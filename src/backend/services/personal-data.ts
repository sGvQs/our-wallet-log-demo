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

// Get all budgets for a year with optional month and category filter
export const getPersonalBudgetsForYear = cache(async (
  year: number,
  month?: number,
  category?: string
) => {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const where: any = {
    userId: user.id,
    targetYear: year,
  };

  if (month) {
    where.targetMonth = month;
  }

  if (category && category !== 'ALL') {
    where.category = category as PersonalExpenseCategory;
  }

  const budgets = await prisma.personalBudget.findMany({
    where,
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

// Category budget vs expense comparison for a month
export type CategoryBudgetComparison = {
  category: PersonalExpenseCategory;
  budgetAmount: number;
  expenseAmount: number;
  expenseCount: number;
  usedPercent: number | null;
  isOverBudget: boolean;
  hasBudget: boolean;
};

export const getPersonalCategoryBudgetComparison = cache(async (month: string): Promise<CategoryBudgetComparison[] | null> => {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const [year, m] = month.split('-').map(Number);

  const [budgets, categorySummary] = await Promise.all([
    getPersonalBudget(year, m),
    getPersonalCategorySummary(month),
  ]);

  if (!budgets || !categorySummary) return null;

  // Get all categories except ALL
  const allCategories = Object.values(PersonalExpenseCategory).filter(c => c !== 'ALL');

  const comparison = allCategories
    .map(category => {
      const budget = budgets.find(b => b.category === category);
      const expense = categorySummary.find(e => e.category === category);

      const budgetAmount = budget?.amount ?? 0;
      const expenseAmount = expense?.total ?? 0;
      const expenseCount = expense?.count ?? 0;

      return {
        category,
        budgetAmount,
        expenseAmount,
        expenseCount,
        usedPercent: budgetAmount > 0 ? Math.round((expenseAmount / budgetAmount) * 100) : null,
        isOverBudget: budgetAmount > 0 && expenseAmount > budgetAmount,
        hasBudget: budgetAmount > 0,
      };
    })
    .filter(c => c.budgetAmount > 0 || c.expenseAmount > 0)
    .sort((a, b) => {
      // Sort: over budget first, then by used percent desc, then by expense amount desc
      if (a.isOverBudget && !b.isOverBudget) return -1;
      if (!a.isOverBudget && b.isOverBudget) return 1;
      if (a.usedPercent !== null && b.usedPercent !== null) {
        return b.usedPercent - a.usedPercent;
      }
      return b.expenseAmount - a.expenseAmount;
    });

  return comparison;
});

// Yearly dashboard data
export const getPersonalDashboardDataYearly = cache(async (year: number) => {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  // Get all budgets for the year
  const budgets = await getPersonalBudgetsForYear(year);
  if (!budgets) return null;

  // Get all expenses for the year
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

  const expenses = await prisma.personalExpense.findMany({
    where: {
      userId: user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Calculate yearly totals
  const yearlyTotalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const yearlyTotalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate monthly data
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthBudget = budgets
      .filter(b => b.targetMonth === month)
      .reduce((sum, b) => sum + b.amount, 0);
    const monthExpenses = expenses
      .filter(e => e.date.getMonth() === i)
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      month,
      budget: monthBudget,
      expenses: monthExpenses,
    };
  });

  // Calculate category summary for the year
  const categorySummary: Record<string, { category: PersonalExpenseCategory; total: number; count: number }> = {};
  for (const expense of expenses) {
    const cat = expense.category;
    if (!categorySummary[cat]) {
      categorySummary[cat] = { category: cat, total: 0, count: 0 };
    }
    categorySummary[cat].total += expense.amount;
    categorySummary[cat].count += 1;
  }

  return {
    year,
    yearlyTotalBudget,
    yearlyTotalExpenses,
    yearlyRemaining: yearlyTotalBudget - yearlyTotalExpenses,
    yearlyUsedPercent: yearlyTotalBudget > 0 ? Math.round((yearlyTotalExpenses / yearlyTotalBudget) * 100) : 0,
    monthlyData,
    categorySummary: Object.values(categorySummary).sort((a, b) => b.total - a.total),
  };
});

// Yearly category budget vs expense comparison
export type YearlyCategoryBudgetComparison = {
  category: PersonalExpenseCategory;
  yearlyBudgetAmount: number;      // 年間予算（12ヶ月合計）
  yearlyExpenseAmount: number;     // 年間支出合計
  yearlyExpenseCount: number;      // 年間取引件数
  usedPercent: number | null;      // 達成率（予算がない場合はnull）
  difference: number;              // 差額（+ = 残り / - = 超過）
  isOverBudget: boolean;           // 予算超過フラグ
  hasBudget: boolean;              // 予算設定有無
  monthlyBreakdown: {              // 月別内訳（ドリルダウン用）
    month: number;
    budgetAmount: number;
    expenseAmount: number;
  }[];
};

export const getPersonalYearlyCategoryComparison = cache(
  async (year: number): Promise<YearlyCategoryBudgetComparison[] | null> => {
    const user = await getAuthenticatedUser();
    if (!user) return null;

    // 年間の全予算を取得
    const budgets = await prisma.personalBudget.findMany({
      where: {
        userId: user.id,
        targetYear: year,
      },
    });

    // 年間の全支出を取得
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

    const expenses = await prisma.personalExpense.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // カテゴリーごとに集計（ALLを除外）
    const allCategories = Object.values(PersonalExpenseCategory)
      .filter(c => c !== 'ALL');

    const comparison = allCategories.map(category => {
      // 月別の予算・支出を計算
      const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const monthBudget = budgets
          .filter(b => b.category === category && b.targetMonth === month)
          .reduce((sum, b) => sum + b.amount, 0);
        const monthExpenses = expenses
          .filter(e => e.category === category && e.date.getMonth() === i)
          .reduce((sum, e) => sum + e.amount, 0);

        return {
          month,
          budgetAmount: monthBudget,
          expenseAmount: monthExpenses,
        };
      });

      // 年間合計を計算
      const yearlyBudgetAmount = monthlyBreakdown.reduce(
        (sum, m) => sum + m.budgetAmount, 0
      );
      const yearlyExpenseAmount = monthlyBreakdown.reduce(
        (sum, m) => sum + m.expenseAmount, 0
      );
      const yearlyExpenseCount = expenses
        .filter(e => e.category === category).length;

      return {
        category,
        yearlyBudgetAmount,
        yearlyExpenseAmount,
        yearlyExpenseCount,
        usedPercent: yearlyBudgetAmount > 0
          ? Math.round((yearlyExpenseAmount / yearlyBudgetAmount) * 100)
          : null,
        difference: yearlyBudgetAmount - yearlyExpenseAmount,
        isOverBudget: yearlyBudgetAmount > 0 && yearlyExpenseAmount > yearlyBudgetAmount,
        hasBudget: yearlyBudgetAmount > 0,
        monthlyBreakdown,
      };
    })
      .filter(c => c.yearlyBudgetAmount > 0 || c.yearlyExpenseAmount > 0)
      .sort((a, b) => {
        // 予算超過を先頭に、次に達成率降順
        if (a.isOverBudget && !b.isOverBudget) return -1;
        if (!a.isOverBudget && b.isOverBudget) return 1;
        if (a.usedPercent !== null && b.usedPercent !== null) {
          return b.usedPercent - a.usedPercent;
        }
        return b.yearlyExpenseAmount - a.yearlyExpenseAmount;
      });

    return comparison;
  }
);
