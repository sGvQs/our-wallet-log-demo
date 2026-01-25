import { Suspense } from 'react';
import { getPersonalDashboardData } from '@/backend/services/personal-data';
import { SummaryCard, CategoryBreakdown, RecentExpenses } from '@/components/personal';
import { Skeleton } from '@/components/common';
import { Card } from '@/components/ui/Card';
import styles from './page.module.css';

export default async function PersonalDashboardPage(
  props: { searchParams: Promise<{ month?: string }> }
) {
  const searchParams = await props.searchParams;
  const currentMonth = searchParams.month || new Date().toISOString().slice(0, 7);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>個人用ダッシュボード</h1>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent currentMonth={currentMonth} />
      </Suspense>
    </div>
  );
}

async function DashboardContent({ currentMonth }: { currentMonth: string }) {
  const data = await getPersonalDashboardData(currentMonth);

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

function DashboardSkeleton() {
  return (
    <div className={styles.grid}>
      <Card><Skeleton style={{ height: '200px' }} /></Card>
      <Card><Skeleton style={{ height: '200px' }} /></Card>
      <div className={styles.fullWidth}>
        <Card><Skeleton style={{ height: '150px' }} /></Card>
      </div>
    </div>
  );
}
