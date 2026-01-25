'use server';

import { prisma } from '@/backend/db';
import { getAuthenticatedUser } from '@/backend/auth/utils';
import { revalidatePath } from 'next/cache';
import { PersonalExpenseCategory } from '@prisma/client';

type BudgetInput = {
  month: number;
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
