import { Suspense } from 'react';
import { getCurrentUser, getPersonalExpenses } from '@/backend/services/data';
import { Card } from '@/components/ui/Card';
import { ExpenseList } from '@/components/family';
import { FilterBar, ExpenseListSkeleton, Skeleton } from '@/components/common';
import { ExpenseActions } from '@/components/expense';
import { FAMILY_CATEGORIES } from '@/lib/constants/categories';
import styles from './page.module.css';

export default async function FamilyExpensesPage(props: { searchParams: Promise<{ month?: string; category?: string }> }) {
  const searchParams = await props.searchParams;
  const currentMonth = searchParams.month || new Date().toISOString().slice(0, 7);

  return (
    <div className="dashboard-grid">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <FilterBar category={FAMILY_CATEGORIES} />
        </div>

        <Suspense fallback={<ExpenseListSkeleton />}>
          <PersonalExpensesSection currentMonth={currentMonth} category={searchParams.category} />
        </Suspense>
      </div>

      <div className="dashboard-sidebar">
        <Card>
          <div className={styles.summaryWrapper}>
            <h3 className={styles.summaryTitle}>自分の支出 ({currentMonth})</h3>
            <Suspense fallback={<Skeleton style={{ height: '3rem', width: '80%' }} />}>
              <PersonalSummarySection currentMonth={currentMonth} category={searchParams.category} />
            </Suspense>
          </div>
          {searchParams.category && searchParams.category !== 'ALL' && (
            <p className={styles.categoryFilter}>カテゴリー: {searchParams.category}</p>
          )}
        </Card>
      </div>

      <ExpenseActions />
    </div>
  );
}

async function PersonalExpensesSection({ currentMonth, category }: { currentMonth: string, category?: string }) {
  const user = await getCurrentUser();
  if (!user) return <AuthRedirect />;

  const myExpenses = await getPersonalExpenses(currentMonth, category) ?? [];

  if (myExpenses.length === 0) {
    return <div className={styles.emptyState}>まだ支出がありません</div>;
  }

  return <ExpenseList expenses={myExpenses} currentUserId={user.id} />;
}

async function PersonalSummarySection({ currentMonth, category }: { currentMonth: string, category?: string }) {
  const myExpenses = await getPersonalExpenses(currentMonth, category) ?? [];
  const myTotalAmount = myExpenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0);

  return <p className={styles.summaryAmount}>¥{myTotalAmount.toLocaleString()}</p>;
}

function AuthRedirect() {
  return (
    <div className={styles.authError}>
      <h1 className={styles.authErrorTitle}>ログインしていません。</h1>
    </div>
  );
}
