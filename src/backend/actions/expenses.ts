'use server';

import { prisma } from '@/backend/db';
import { getAuthenticatedUser } from '@/backend/auth/utils';
import { revalidatePath } from 'next/cache';
import { ExpenseCategory } from '@/types/prisma';

export async function addExpense(prevState: any, formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: 'Not authenticated' };

  const amount = parseInt(formData.get('amount') as string);
  const description = formData.get('description') as string | null;
  const shop = formData.get("shop") as string | null;
  const dateStr = formData.get('date') as string;
  const year = parseInt(formData.get('year') as string);
  const month = parseInt(formData.get('month') as string);
  const day = parseInt(formData.get('day') as string);

  let recordDate = new Date();
  if (year && month && day) {
    // Note: Month is 0-indexed in JS Date
    recordDate = new Date(year, month - 1, day);
  } else if (dateStr) {
    recordDate = new Date(dateStr);
  }

  const category = formData.get('category') as ExpenseCategory;

  if (!amount || isNaN(amount)) return { error: '金額を正しく入力してください' };

  // Note: Expense is now linked to Group if the user is in one.
  const userWithGroups = await prisma.user.findUnique({
    where: { id: user.id },
    include: { groups: { select: { id: true }, take: 1 } }
  });
  const groupId = userWithGroups?.groups[0]?.id || null;

  try {
    await prisma.expense.create({
      data: {
        amount,
        description,
        shop,
        date: recordDate,
        category,
        userId: user.id, // Int ID
        groupId, // Explicit group link
      }
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }

  revalidatePath('/personal');
  return { success: true };
}

export async function updateExpense(expenseId: string, formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: 'Not authenticated' };

  // Verify ownership (only the owner can edit)
  const expense = await prisma.expense.findUnique({
    where: { id: expenseId }
  });

  if (!expense) return { error: '支出が見つかりません' };

  if (expense.userId !== user.id) {
    return { error: '権限がありません' };
  }

  const amount = parseInt(formData.get('amount') as string);
  const description = formData.get('description') as string | null;
  const shop = formData.get("shop") as string | null;
  const year = parseInt(formData.get('year') as string);
  const month = parseInt(formData.get('month') as string);
  const day = parseInt(formData.get('day') as string);
  const category = formData.get('category') as ExpenseCategory;

  if (!amount || isNaN(amount)) return { error: '金額を正しく入力してください' };

  let recordDate = new Date();
  if (year && month && day) {
    recordDate = new Date(year, month - 1, day);
  }

  try {
    await prisma.expense.update({
      where: { id: expenseId },
      data: {
        amount,
        description,
        shop,
        date: recordDate,
        category,
      }
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }

  revalidatePath('/personal');
  revalidatePath('/group');
  return { success: true };
}

export async function deleteExpense(expenseId: string) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: 'Not authenticated' };

  // Verify ownership or group admin status
  const expense = await prisma.expense.findUnique({
    where: { id: expenseId }
  });

  if (!expense) return { error: 'Not found' };

  if (expense.userId !== user.id) {
    return { error: '権限がありません' };
  }

  await prisma.expense.delete({ where: { id: expenseId } });
  revalidatePath('/personal');
  revalidatePath('/group');
  return { success: true };
}
