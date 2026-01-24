import { Suspense } from 'react';
import { getPersonalBudgetsForYear } from '@/backend/services/personal-data';
import { BudgetPageClient } from './BudgetPageClient';
import { Skeleton } from '@/components/Skeleton';
import { Card } from '@/components/ui/Card';

export default async function PersonalBudgetPage(
  props: { searchParams: Promise<{ year?: string }> }
) {
  const searchParams = await props.searchParams;
  const currentYear = new Date().getFullYear();
  const year = searchParams.year ? parseInt(searchParams.year) : currentYear;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1
        style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          color: 'var(--color-text-main)',
        }}
      >
        予算設定
      </h1>

      <Suspense fallback={<BudgetSkeleton />}>
        <BudgetContent year={year} />
      </Suspense>
    </div>
  );
}

async function BudgetContent({ year }: { year: number }) {
  const budgets = await getPersonalBudgetsForYear(year);

  if (budgets === null) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>ログインが必要です</p>
        </div>
      </Card>
    );
  }

  return <BudgetPageClient year={year} initialBudgets={budgets} />;
}

function BudgetSkeleton() {
  return (
    <Card>
      <Skeleton style={{ height: '400px' }} />
    </Card>
  );
}
