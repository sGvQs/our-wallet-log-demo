'use server';

import { prisma } from '@/backend/db';
import { getAuthenticatedUser } from '@/backend/auth/utils';
import { revalidatePath } from 'next/cache';
import { PersonalExpenseCategory } from '@prisma/client';

export async function addPersonalExpense(prevState: any, formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: 'Not authenticated' };

  const amount = parseInt(formData.get('amount') as string);
  const description = formData.get('description') as string | null;
  const shop = formData.get('shop') as string | null;
  const year = parseInt(formData.get('year') as string);
  const month = parseInt(formData.get('month') as string);
  const day = parseInt(formData.get('day') as string);
  const category = formData.get('category') as PersonalExpenseCategory;

  if (!amount || isNaN(amount)) return { error: '金額を正しく入力してください' };

  let recordDate = new Date();
  if (year && month && day) {
    recordDate = new Date(year, month - 1, day);
  }

  try {
    await prisma.personalExpense.create({
      data: {
        amount,
        description: description || null,
        shop: shop || null,
        date: recordDate,
        category,
        userId: user.id,
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }

  revalidatePath('/personal/expenses');
  revalidatePath('/personal/dashboard');
  return { success: true };
}

export async function updatePersonalExpense(expenseId: string, formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: 'Not authenticated' };

  const expense = await prisma.personalExpense.findUnique({
    where: { id: expenseId },
  });

  if (!expense) return { error: '支出が見つかりません' };
  if (expense.userId !== user.id) return { error: '権限がありません' };

  const amount = parseInt(formData.get('amount') as string);
  const description = formData.get('description') as string | null;
  const shop = formData.get('shop') as string | null;
  const year = parseInt(formData.get('year') as string);
  const month = parseInt(formData.get('month') as string);
  const day = parseInt(formData.get('day') as string);
  const category = formData.get('category') as PersonalExpenseCategory;

  if (!amount || isNaN(amount)) return { error: '金額を正しく入力してください' };

  let recordDate = new Date();
  if (year && month && day) {
    recordDate = new Date(year, month - 1, day);
  }

  try {
    await prisma.personalExpense.update({
      where: { id: expenseId },
      data: {
        amount,
        description: description || null,
        shop: shop || null,
        date: recordDate,
        category,
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }

  revalidatePath('/personal/expenses');
  revalidatePath('/personal/dashboard');
  return { success: true };
}

export async function deletePersonalExpense(expenseId: string) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: 'Not authenticated' };

  const expense = await prisma.personalExpense.findUnique({
    where: { id: expenseId },
  });

  if (!expense) return { error: 'Not found' };
  if (expense.userId !== user.id) return { error: '権限がありません' };

  await prisma.personalExpense.delete({ where: { id: expenseId } });
  
  revalidatePath('/personal/expenses');
  revalidatePath('/personal/dashboard');
  return { success: true };
}
