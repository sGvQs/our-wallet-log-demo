import { prisma } from '@/backend/db';
import { cache } from 'react';
import { getAuthenticatedUser } from '@/backend/auth/utils';
import { PersonalExpenseCategory } from '@prisma/client';

// Get personal expenses for a given month
export const getPersonalExpensesData = cache(async (month?: string, category?: string) => {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const where: any = {
    userId: user.id,
  };

  if (month) {
    const [year, m] = month.split('-').map(Number);
    const startDate = new Date(year, m - 1, 1);
    const endDate = new Date(year, m, 0, 23, 59, 59, 999);

    where.date = {
      gte: startDate,
      lte: endDate,
    };
  }

  if (category && category !== 'ALL') {
    where.category = category as PersonalExpenseCategory;
  }

  const expenses = await prisma.personalExpense.findMany({
    where,
    orderBy: { date: 'desc' },
  });

  return expenses;
});

// Get personal budget for a specific year and month
export const getPersonalBudget = cache(async (year: number, month: number) => {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const budgets = await prisma.personalBudget.findMany({
    where: {
      userId: user.id,
      targetYear: year,
      targetMonth: month,
    },
  });

  return budgets;
});

// Get all budgets for a year
export const getPersonalBudgetsForYear = cache(async (year: number) => {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const budgets = await prisma.personalBudget.findMany({
    where: {
      userId: user.id,
      targetYear: year,
    },
    orderBy: [
      { targetMonth: 'asc' },
      { category: 'asc' },
    ],
  });

  return budgets;
});

// Get category summary for a month (expenses grouped by category)
export const getPersonalCategorySummary = cache(async (month: string) => {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const [year, m] = month.split('-').map(Number);
  const startDate = new Date(year, m - 1, 1);
  const endDate = new Date(year, m, 0, 23, 59, 59, 999);

  const expenses = await prisma.personalExpense.findMany({
    where: {
      userId: user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Group by category
  const summary: Record<string, { category: PersonalExpenseCategory; total: number; count: number }> = {};

  for (const expense of expenses) {
    const cat = expense.category;
    if (!summary[cat]) {
      summary[cat] = { category: cat, total: 0, count: 0 };
    }
    summary[cat].total += expense.amount;
    summary[cat].count += 1;
  }

  return Object.values(summary).sort((a, b) => b.total - a.total);
});

// Get total budget for a month
export const getPersonalBudgetTotal = cache(async (year: number, month: number) => {
  const budgets = await getPersonalBudget(year, month);
  if (!budgets) return 0;
  
  return budgets.reduce((sum, b) => sum + b.amount, 0);
});

// Get total expenses for a month
export const getPersonalExpenseTotal = cache(async (month: string) => {
  const expenses = await getPersonalExpensesData(month);
  if (!expenses) return 0;
  
  return expenses.reduce((sum, e) => sum + e.amount, 0);
});

// Dashboard data - all in one call
export const getPersonalDashboardData = cache(async (month: string) => {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const [year, m] = month.split('-').map(Number);

  const [expenses, budgets, categorySummary] = await Promise.all([
    getPersonalExpensesData(month),
    getPersonalBudget(year, m),
    getPersonalCategorySummary(month),
  ]);

  const totalExpenses = expenses?.reduce((sum, e) => sum + e.amount, 0) ?? 0;
  const totalBudget = budgets?.reduce((sum, b) => sum + b.amount, 0) ?? 0;

  return {
    expenses: expenses ?? [],
    budgets: budgets ?? [],
    categorySummary: categorySummary ?? [],
    totalExpenses,
    totalBudget,
    budgetRemaining: totalBudget - totalExpenses,
    budgetUsedPercent: totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0,
  };
});
