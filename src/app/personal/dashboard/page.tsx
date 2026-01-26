import { Suspense } from 'react';
import {
  getPersonalDashboardData,
  getPersonalCategoryBudgetComparison,
  getPersonalDashboardDataYearly,
} from '@/backend/services/personal-data';
import {
  SummaryCard,
  CategoryBreakdown,
  RecentExpenses,
  CategoryBudgetCard,
  ViewToggle,
  YearlySummaryCard,
  MonthlyTrendChart,
} from '@/components/personal';
import type { ViewMode } from '@/components/personal';
import { Skeleton } from '@/components/common';
import { Card } from '@/components/ui/Card';
import styles from './page.module.css';

interface SearchParams {
  month?: string;
  year?: string;
  view?: string;
}

export default async function PersonalDashboardPage(
  props: { searchParams: Promise<SearchParams> }
) {
  const searchParams = await props.searchParams;
  
  // Determine view mode
  const viewMode: ViewMode = searchParams.view === 'yearly' ? 'yearly' : 'monthly';
  const currentYear = searchParams.year 
    ? parseInt(searchParams.year, 10) 
    : new Date().getFullYear();
  const currentMonth = searchParams.month || new Date().toISOString().slice(0, 7);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>個人用ダッシュボード</h1>
        <ViewToggle mode={viewMode} year={currentYear} />
      </div>

      <Suspense fallback={<DashboardSkeleton viewMode={viewMode} />}>
        {viewMode === 'yearly' ? (
          <YearlyDashboardContent year={currentYear} />
        ) : (
          <MonthlyDashboardContent currentMonth={currentMonth} />
        )}
      </Suspense>
    </div>
  );
}

async function MonthlyDashboardContent({ currentMonth }: { currentMonth: string }) {
  const [data, categoryComparison] = await Promise.all([
    getPersonalDashboardData(currentMonth),
    getPersonalCategoryBudgetComparison(currentMonth),
  ]);

  if (!data) {
    return (
      <Card>
        <div className={styles.authError}>
          <p>ログインが必要です</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={styles.grid}>
      <SummaryCard
        totalBudget={data.totalBudget}
        totalExpenses={data.totalExpenses}
        budgetUsedPercent={data.budgetUsedPercent}
        month={currentMonth}
      />
      <CategoryBudgetCard comparisons={categoryComparison ?? []} />
      <CategoryBreakdown
        categorySummary={data.categorySummary}
        totalExpenses={data.totalExpenses}
      />
      <div className={styles.fullWidth}>
        <RecentExpenses expenses={data.expenses} month={currentMonth} />
      </div>
    </div>
  );
}

async function YearlyDashboardContent({ year }: { year: number }) {
  const data = await getPersonalDashboardDataYearly(year);

  if (!data) {
    return (
      <Card>
        <div className={styles.authError}>
          <p>ログインが必要です</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={styles.grid}>
      <YearlySummaryCard
        year={data.year}
        yearlyTotalBudget={data.yearlyTotalBudget}
        yearlyTotalExpenses={data.yearlyTotalExpenses}
        yearlyRemaining={data.yearlyRemaining}
        yearlyUsedPercent={data.yearlyUsedPercent}
      />
      <div className={styles.fullWidth}>
        <MonthlyTrendChart monthlyData={data.monthlyData} year={data.year} />
      </div>
      <CategoryBreakdown
        categorySummary={data.categorySummary}
        totalExpenses={data.yearlyTotalExpenses}
      />
    </div>
  );
}

function DashboardSkeleton({ viewMode }: { viewMode: ViewMode }) {
  if (viewMode === 'yearly') {
    return (
      <div className={styles.grid}>
        <Card><Skeleton style={{ height: '200px' }} /></Card>
        <div className={styles.fullWidth}>
          <Card><Skeleton style={{ height: '280px' }} /></Card>
        </div>
        <Card><Skeleton style={{ height: '200px' }} /></Card>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      <Card><Skeleton style={{ height: '200px' }} /></Card>
      <Card><Skeleton style={{ height: '300px' }} /></Card>
      <Card><Skeleton style={{ height: '200px' }} /></Card>
      <div className={styles.fullWidth}>
        <Card><Skeleton style={{ height: '150px' }} /></Card>
      </div>
    </div>
  );
}
