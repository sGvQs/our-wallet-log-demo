import { Suspense } from 'react';
import { getPersonalExpensesData, getPersonalBudget } from '@/backend/services/personal-data';
import { Card } from '@/components/ui/Card';
import { PersonalExpenseList } from '@/components/personal/PersonalExpenseList';
import { PersonalFilterBar } from '@/components/personal/PersonalFilterBar';
import { PersonalExpenseActions } from '@/components/personal/PersonalExpenseActions';
import { ExpenseListSkeleton, Skeleton } from '@/components/Skeleton';
import { FilterBar } from '@/components/FilterBar';
import { PERSONAL_CATEGORIES } from '@/types/category';

export default async function PersonalExpensesPage(
  props: { searchParams: Promise<{ month?: string; category?: string }> }
) {
  const searchParams = await props.searchParams;
  const currentMonth = searchParams.month || new Date().toISOString().slice(0, 7);

  return (
    <div className="dashboard-grid">
      {/* Main Content: Expense List */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>個人用支出一覧</h2>
          <FilterBar category={PERSONAL_CATEGORIES} />
        </div>

        <Suspense fallback={<ExpenseListSkeleton />}>
          <ExpensesSection currentMonth={currentMonth} category={searchParams.category} />
        </Suspense>
      </div>

      {/* Sidebar: Summary */}
      <div className="dashboard-sidebar">
        <Card>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
              今月の支出 ({currentMonth})
            </h3>
            <Suspense fallback={<Skeleton className="skeleton-text" style={{ height: '3rem', width: '80%' }} />}>
              <SummarySection currentMonth={currentMonth} category={searchParams.category} />
            </Suspense>
          </div>
          {searchParams.category && searchParams.category !== 'ALL' && (
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              カテゴリー: {searchParams.category}
            </p>
          )}
        </Card>
      </div>

      {/* Floating Action Button + Modal */}
      <PersonalExpenseActions />
    </div>
  );
}

async function ExpensesSection({ currentMonth, category }: { currentMonth: string, category?: string }) {
  const expenses = await getPersonalExpensesData(currentMonth, category);

  if (!expenses) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>ログインが必要です</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
        まだ支出がありません
      </div>
    );
  }

  return <PersonalExpenseList expenses={expenses} />;
}

async function SummarySection({ currentMonth, category }: { currentMonth: string, category?: string }) {
  const expenses = await getPersonalExpensesData(currentMonth, category);
  const totalAmount = expenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0) ?? 0;

  const [year, month] = currentMonth.split('-').map(Number);
  const budgets = await getPersonalBudget(year, month);
  const totalBudget = budgets?.reduce((sum, b) => sum + b.amount, 0) ?? 0;

  return (
    <div>
      <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
        ¥{totalAmount.toLocaleString()}
      </p>
      {totalBudget > 0 && (
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          予算: ¥{totalBudget.toLocaleString()}
          <span style={{ marginLeft: '0.5rem', color: totalAmount > totalBudget ? '#e74c3c' : 'var(--color-primary-personal)' }}>
            ({Math.round((totalAmount / totalBudget) * 100)}%)
          </span>
        </p>
      )}
    </div>
  );
}
