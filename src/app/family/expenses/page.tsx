import { Suspense } from 'react';
import { getCurrentUser, getPersonalExpenses } from '@/backend/services/data';
import { Card } from '@/components/ui/Card';
import { ExpenseList } from '@/components/family';
import { FilterBar, ExpenseListSkeleton, Skeleton } from '@/components/common';
import { ExpenseActions } from '@/components/expense';
import { FAMILY_CATEGORIES } from '@/lib/constants/categories';

export default async function FamilyExpensesPage(props: { searchParams: Promise<{ month?: string; category?: string }> }) {
  const searchParams = await props.searchParams;
  const currentMonth = searchParams.month || new Date().toISOString().slice(0, 7);

  return (
    <div className="dashboard-grid">
      {/* Main Content: My List */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>自分の支出一覧</h2>
          <FilterBar category={FAMILY_CATEGORIES} />
        </div>

        <Suspense fallback={<ExpenseListSkeleton />}>
          <PersonalExpensesSection currentMonth={currentMonth} category={searchParams.category} />
        </Suspense>
      </div>

      {/* Sidebar: Summary */}
      <div className="dashboard-sidebar">
        <Card>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>自分の支出 ({currentMonth})</h3>
            <Suspense fallback={<Skeleton className="skeleton-text" style={{ height: '3rem', width: '80%' }} />}>
              <PersonalSummarySection currentMonth={currentMonth} category={searchParams.category} />
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
      <ExpenseActions />
    </div>
  );
}

async function PersonalExpensesSection({ currentMonth, category }: { currentMonth: string, category?: string }) {
  const user = await getCurrentUser();
  if (!user) return <AuthRedirect />;

  const myExpenses = await getPersonalExpenses(currentMonth, category) ?? [];

  if (myExpenses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
        まだ支出がありません
      </div>
    );
  }

  return <ExpenseList expenses={myExpenses} currentUserId={user.id} />;
}

async function PersonalSummarySection({ currentMonth, category }: { currentMonth: string, category?: string }) {
  const myExpenses = await getPersonalExpenses(currentMonth, category) ?? [];
  const myTotalAmount = myExpenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0);

  return (
    <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
      ¥{myTotalAmount.toLocaleString()}
    </p>
  );
}

function AuthRedirect() {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>ログインしていません。</h1>
    </div>
  );
}
