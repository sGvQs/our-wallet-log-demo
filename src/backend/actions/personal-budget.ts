'use server';

import { prisma } from '@/backend/db';
import { getAuthenticatedUser } from '@/backend/auth/utils';
import { revalidatePath } from 'next/cache';
import { PersonalExpenseCategory } from '@prisma/client';

type BudgetInput = {
  month: number;
  category: PersonalExpenseCategory;
  amount: number;
};

export async function savePersonalBudgets(
  year: number,
  budgets: BudgetInput[]
) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: 'Not authenticated' };

  try {
    // Use transaction for atomic upsert
    await prisma.$transaction(async (tx) => {
      for (const budget of budgets) {
        // Try to find existing budget
        const existing = await tx.personalBudget.findFirst({
          where: {
            userId: user.id,
            targetYear: year,
            targetMonth: budget.month,
            category: budget.category,
          },
        });

        if (existing) {
          // Update existing
          await tx.personalBudget.update({
            where: { id: existing.id },
            data: { amount: budget.amount },
          });
        } else {
          // Create new
          await tx.personalBudget.create({
            data: {
              userId: user.id,
              targetYear: year,
              targetMonth: budget.month,
              category: budget.category,
              amount: budget.amount,
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
