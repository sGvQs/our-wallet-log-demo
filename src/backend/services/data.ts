import { prisma } from '@/backend/db';
import { cache } from 'react';
import { getAuthenticatedUser } from '@/backend/auth/utils';
import { GroupSettingsData, GroupWithMembers, ExpenseWithPayer, User, Expense, UserBasic } from '@/types/prisma';

export const getCurrentUser = cache(async () => {
  return await getAuthenticatedUser();
});

export const getUserGroup = cache(async () => {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  // Find the primary group for this user (Implicit Relation)
  const userWithGroups = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      groups: {
        include: {
          users: {
            select: { id: true, name: true, email: true }
          }
        }
      }
    }
  });

  // Assuming single group focus for demo
  return userWithGroups?.groups[0] || null;
});

export const getPersonalExpenses = cache(async (month?: string, category?: string) => {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const where: any = {
    OR: [
      { userId: user.id },
    ]
  };

  if (month) {
    // month format: YYYY-MM
    const [year, m] = month.split('-').map(Number);
    const startDate = new Date(year, m - 1, 1);
    const endDate = new Date(year, m, 0, 23, 59, 59, 999);

    where.date = {
      gte: startDate,
      lte: endDate
    };
  }

  if (category && category !== 'ALL') {
    where.category = category;
  }

  const expenses = await prisma.expense.findMany({
    where,
    orderBy: { date: 'desc' }
  });

  return expenses.map((e: any) => ({
    ...e,
    payerId: e.userId // Alias for compatibility with ExpenseList
  }));
});


export const getGroupExpenses = cache(async (month?: string, category?: string) => {
  const group = await getUserGroup();
  if (!group) return [];

  // Use explicit groupId if available, otherwise fallback to member user IDs (for legacy data)
  const where: any = {
    OR: [
      { groupId: group.id },
      { userId: { in: group.users.map((u: UserBasic) => u.id) }, groupId: null }
    ]
  };

  if (month) {
    // month format: YYYY-MM
    const [year, m] = month.split('-').map(Number);
    const startDate = new Date(year, m - 1, 1);
    const endDate = new Date(year, m, 0, 23, 59, 59, 999);

    where.date = {
      gte: startDate,
      lte: endDate
    };
  }

  if (category && category !== 'ALL') {
    where.category = category;
  }

  const expenses = await prisma.expense.findMany({
    where,
    include: {
      user: {
        select: { id: true, name: true }
      }
    },
    orderBy: { date: 'desc' }
  });

  // Map 'user' to 'payer' to keep frontend compatibility if we want, or just update frontend.
  // The frontend likely expects 'payer' or similar. 
  // Let's return as is but we might need to update frontend to use `expense.user`.
  return expenses.map((e: any) => ({
    ...e,
    payer: e.user, // Alias for compatibility
    payerId: e.userId // Alias for compatibility
  }));
});

export async function getGroupSettingsData() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      groups: true,
      createdGroups: {
        include: {
          group: true
        }
      },
      pastGroups: {
        include: {
          group: true
        }
      }
    }
  });

  return userData;
}
