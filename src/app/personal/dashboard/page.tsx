import { Suspense } from 'react';
import { getPersonalDashboardData } from '@/backend/services/personal-data';
import { SummaryCard } from '@/components/personal/SummaryCard';
import { CategoryBreakdown } from '@/components/personal/CategoryBreakdown';
import { RecentExpenses } from '@/components/personal/RecentExpenses';
import { Skeleton } from '@/components/common';
import { Card } from '@/components/ui/Card';

export default async function PersonalDashboardPage(
  props: { searchParams: Promise<{ month?: string }> }
) {
  const searchParams = await props.searchParams;
  const currentMonth = searchParams.month || new Date().toISOString().slice(0, 7);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          color: 'var(--color-text-main)',
        }}
      >
        個人用ダッシュボード
      </h1>

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
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>ログインが必要です</p>
        </div>
      </Card>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}
    >
      {/* Summary Card */}
      <SummaryCard
        totalBudget={data.totalBudget}
        totalExpenses={data.totalExpenses}
        budgetUsedPercent={data.budgetUsedPercent}
        month={currentMonth}
      />

      {/* Category Breakdown */}
      <CategoryBreakdown
        categorySummary={data.categorySummary}
        totalExpenses={data.totalExpenses}
      />

      {/* Recent Expenses - full width */}
      <div style={{ gridColumn: '1 / -1' }}>
        <RecentExpenses expenses={data.expenses} month={currentMonth} />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}
    >
      <Card>
        <Skeleton style={{ height: '200px' }} />
      </Card>
      <Card>
        <Skeleton style={{ height: '200px' }} />
      </Card>
      <div style={{ gridColumn: '1 / -1' }}>
        <Card>
          <Skeleton style={{ height: '150px' }} />
        </Card>
      </div>
    </div>
  );
}
