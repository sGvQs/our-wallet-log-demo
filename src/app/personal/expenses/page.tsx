import { Suspense } from 'react';
import { getPersonalExpensesData, getPersonalBudget } from '@/backend/services/personal-data';
import { Card } from '@/components/ui/Card';
import { PersonalExpenseList, PersonalExpenseActions } from '@/components/personal';
import { ExpenseListSkeleton, Skeleton, FilterBar } from '@/components/common';
import { PERSONAL_CATEGORIES } from '@/lib/constants/categories';
import styles from './page.module.css';

export default async function PersonalExpensesPage(
  props: { searchParams: Promise<{ month?: string; category?: string }> }
) {
  const searchParams = await props.searchParams;
  const currentMonth = searchParams.month || new Date().toISOString().slice(0, 7);

  return (
    <div className="dashboard-grid">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <FilterBar category={PERSONAL_CATEGORIES} />
        </div>

        <Suspense fallback={<ExpenseListSkeleton />}>
          <ExpensesSection currentMonth={currentMonth} category={searchParams.category} />
        </Suspense>
      </div>

      <div className="dashboard-sidebar">
        <Card>
          <div className={styles.summaryWrapper}>
            <h3 className={styles.summaryTitle}>今月の支出 ({currentMonth})</h3>
            <Suspense fallback={<Skeleton style={{ height: '3rem', width: '80%' }} />}>
              <SummarySection currentMonth={currentMonth} category={searchParams.category} />
            </Suspense>
          </div>
          {searchParams.category && searchParams.category !== 'ALL' && (
            <p className={styles.categoryFilter}>カテゴリー: {searchParams.category}</p>
          )}
        </Card>
      </div>

      <PersonalExpenseActions />
    </div>
  );
}

async function ExpensesSection({ currentMonth, category }: { currentMonth: string, category?: string }) {
  const expenses = await getPersonalExpensesData(currentMonth, category);

  if (!expenses) {
    return <div className={styles.authError}><p>ログインが必要です</p></div>;
  }

  if (expenses.length === 0) {
    return <div className={styles.emptyState}>まだ支出がありません</div>;
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
      <p className={styles.summaryAmount}>¥{totalAmount.toLocaleString()}</p>
      {totalBudget > 0 && (
        <p className={styles.budgetInfo}>
          予算: ¥{totalBudget.toLocaleString()}
          <span className={`${styles.budgetPercent} ${totalAmount > totalBudget ? styles.budgetOver : styles.budgetUnder}`}>
            ({Math.round((totalAmount / totalBudget) * 100)}%)
          </span>
        </p>
      )}
    </div>
  );
}
