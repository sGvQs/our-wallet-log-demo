'use server';

import { prisma } from '@/backend/db';
import { getAuthenticatedUser } from '@/backend/auth/utils';
import { revalidatePath } from 'next/cache';
import { PersonalExpenseCategory } from '@prisma/client';
import { randomUUID } from 'crypto';

type BudgetInput = {
  month: number;
  category: PersonalExpenseCategory;
  amount: number;
  who: string | null;
  description: string | null;
};

type BulkBudgetInput = {
  startMonth: number;
  endMonth: number;
  category: PersonalExpenseCategory;
  amount: number;
  who: string | null;
  description: string | null;
};

export async function updatePersonalBudgets(
  year: number,
  budget: BudgetInput
) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: 'Not authenticated' };

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.personalBudget.findFirst({
        where: {
          userId: user.id,
          targetYear: year,
          targetMonth: budget.month,
          category: budget.category,
        }
      });

      if(existing){
        await tx.personalBudget.update({
          where: {
            id : existing.id
          },
          data: {
            amount: budget.amount,
            targetYear: year,
            targetMonth: budget.month,
            category: budget.category,
            who: budget.who,
            description: budget.description,
          }
        });
      }
    });

    revalidatePath('/personal/budget');
    revalidatePath('/personal/dashboard');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function createPersonalBudgets(
  year: number,
  budget: BudgetInput
) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: 'Not authenticated' };

  try {
    await prisma.$transaction(async (tx) => {
          await tx.personalBudget.create({
            data: {
              userId: user.id,
              targetYear: year,
              targetMonth: budget.month,
              category: budget.category,
              amount: budget.amount,
              who: budget.who,
              description: budget.description,
            },
          });
    });

    // revalidatePath('/personal/budget');
    revalidatePath('/personal/dashboard');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

export async function deletePersonalBudget(budgetId: number) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: 'Not authenticated' };

  const budget = await prisma.personalBudget.findUnique({
    where: { id: budgetId },
  });

  if (!budget) return { error: 'Budget not found' };
  if (budget.userId !== user.id) return { error: 'Unauthorized' };

  await prisma.personalBudget.delete({
    where: { id: budgetId },
  });

  revalidatePath('/personal/budget');
  revalidatePath('/personal/dashboard');
  return { success: true };
}

/**
 * Create recurring budgets from startMonth to endMonth in the specified year.
 * If budgets already exist for any month/category combination, they will be updated.
 */
export async function createBulkPersonalBudgets(
  year: number,
  budget: BulkBudgetInput
) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: 'Not authenticated' };

  if (budget.startMonth > budget.endMonth) {
    return { error: '開始月は終了月以前である必要があります' };
  }

  try {
    const recurringGroupId = randomUUID();
    
    await prisma.$transaction(async (tx) => {
      for (let month = budget.startMonth; month <= budget.endMonth; month++) {
        // Check if budget already exists for this month/category
        const existing = await tx.personalBudget.findFirst({
          where: {
            userId: user.id,
            targetYear: year,
            targetMonth: month,
            category: budget.category,
          },
        });

        if (existing) {
          // Update existing budget
          await tx.personalBudget.update({
            where: { id: existing.id },
            data: {
              amount: budget.amount,
              who: budget.who,
              description: budget.description,
              isRecurring: true,
              recurringGroupId,
            },
          });
        } else {
          // Create new budget
          await tx.personalBudget.create({
            data: {
              userId: user.id,
              targetYear: year,
              targetMonth: month,
              category: budget.category,
              amount: budget.amount,
              who: budget.who,
              description: budget.description,
              isRecurring: true,
              recurringGroupId,
            },
          });
        }
      }
    });

    revalidatePath('/personal/budget');
    revalidatePath('/personal/dashboard');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

/**
 * Update a budget and optionally apply changes to all future months in the same recurring group.
 */
export async function updateFuturePersonalBudgets(
  budgetId: number,
  data: {
    amount: number;
    who: string | null;
    description: string | null;
    applyToFuture: boolean;
  }
) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: 'Not authenticated' };

  try {
    const budget = await prisma.personalBudget.findUnique({
      where: { id: budgetId },
    });

    if (!budget) return { error: 'Budget not found' };
    if (budget.userId !== user.id) return { error: 'Unauthorized' };

    await prisma.$transaction(async (tx) => {
      // Update the current budget
      await tx.personalBudget.update({
        where: { id: budgetId },
        data: {
          amount: data.amount,
          who: data.who,
          description: data.description,
        },
      });

      // If applying to future months and budget has a recurring group
      if (data.applyToFuture && budget.recurringGroupId) {
        await tx.personalBudget.updateMany({
          where: {
            userId: user.id,
            recurringGroupId: budget.recurringGroupId,
            OR: [
              { targetYear: { gt: budget.targetYear } },
              {
                targetYear: budget.targetYear,
                targetMonth: { gt: budget.targetMonth },
              },
            ],
          },
          data: {
            amount: data.amount,
            who: data.who,
            description: data.description,
          },
        });
      }
    });

    revalidatePath('/personal/budget');
    revalidatePath('/personal/dashboard');
    return { success: true };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}
