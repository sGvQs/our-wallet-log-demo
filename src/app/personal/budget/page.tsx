import { Suspense } from 'react';
import { getPersonalBudgetsForYear } from '@/backend/services/personal-data';
import { Card } from '@/components/ui/Card';
import { BudgetList } from '@/components/personal/BudgetList';
import { BudgetFilterBar } from '@/components/personal/BudgetFilterBar';
import { BudgetActions } from '@/components/personal/BudgetActions';
import { ExpenseListSkeleton, Skeleton } from '@/components/Skeleton';

export default async function PersonalBudgetPage(
  props: { searchParams: Promise<{ year?: string; month?: string; category?: string }> }
) {
  const searchParams = await props.searchParams;
  const currentYear = new Date().getFullYear();
  const year = searchParams.year ? parseInt(searchParams.year) : currentYear;
  const month = searchParams.month ? parseInt(searchParams.month) : undefined;
  const category = searchParams.category;

  return (
    <div className="dashboard-grid">
      {/* Main Content: Budget List */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>予算設定</h2>
          {/* Year selector */}
          <YearSelector year={year} />
        </div>

        <Card style={{ marginBottom: '1rem' }}>
          <BudgetFilterBar year={year} />
        </Card>

        <Suspense fallback={<ExpenseListSkeleton />}>
          <BudgetSection year={year} month={month} category={category} />
        </Suspense>
      </div>

      {/* Sidebar: Summary */}
      <div className="dashboard-sidebar">
        <Card>
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
              {year}年の予算合計
            </h3>
            <Suspense fallback={<Skeleton className="skeleton-text" style={{ height: '3rem', width: '80%' }} />}>
              <SummarySection year={year} />
            </Suspense>
          </div>
        </Card>
      </div>

      {/* Floating Action Button + Dialog */}
      <BudgetActions />
    </div>
  );
}

function YearSelector({ year }: { year: number }) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div style={{ display: 'flex', gap: '0.375rem' }}>
      {years.map((y) => (
        <a
          key={y}
          href={`/personal/budget?year=${y}`}
          style={{
            padding: '0.375rem 0.75rem',
            fontSize: '0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: y === year ? 'var(--color-primary-personal)' : 'transparent',
            color: y === year ? 'white' : 'var(--color-text-muted)',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          {y}
        </a>
      ))}
    </div>
  );
}

async function BudgetSection({ year, month, category }: { year: number; month?: number; category?: string }) {
  const budgets = await getPersonalBudgetsForYear(year, month, category);

  if (!budgets) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>ログインが必要です</p>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
        <p>予算が設定されていません</p>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
          下のボタンから予算を追加しましょう
        </p>
      </div>
    );
  }

  return <BudgetList budgets={budgets} />;
}

async function SummarySection({ year }: { year: number }) {
  const budgets = await getPersonalBudgetsForYear(year);
  const totalAmount = budgets?.reduce((sum, b) => sum + b.amount, 0) ?? 0;

  return (
    <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-personal)' }}>
      ¥{totalAmount.toLocaleString()}
    </p>
  );
}
