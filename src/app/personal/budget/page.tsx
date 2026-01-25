import { Suspense } from 'react';
import { getPersonalBudgetsForYear } from '@/backend/services/personal-data';
import { Card } from '@/components/ui/Card';
import { BudgetList, BudgetFilterBar, BudgetActions } from '@/components/personal';
import { ExpenseListSkeleton, Skeleton } from '@/components/common';
import styles from './page.module.css';

function parseMonthParam(monthParam: string | undefined, defaultYear: number): { year: number; month?: number } {
  if (!monthParam) return { year: defaultYear };
  if (monthParam.includes('-')) {
    const [yearStr, monthStr] = monthParam.split('-');
    return { year: parseInt(yearStr), month: parseInt(monthStr) };
  }
  return { year: defaultYear, month: parseInt(monthParam) };
}

export default async function PersonalBudgetPage(
  props: { searchParams: Promise<{ month?: string; category?: string }> }
) {
  const searchParams = await props.searchParams;
  const currentYear = new Date().getFullYear();
  const { year, month } = parseMonthParam(searchParams.month, currentYear);
  const category = searchParams.category;

  return (
    <div className="dashboard-grid">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2 className={styles.headerTitle}>予算設定</h2>
          <YearSelector year={year} month={month} />
        </div>

        <Card className={styles.filterCard}>
          <BudgetFilterBar year={year} />
        </Card>

        <Suspense fallback={<ExpenseListSkeleton />}>
          <BudgetSection year={year} month={month} category={category} />
        </Suspense>
      </div>

      <div className="dashboard-sidebar">
        <Card>
          <div className={styles.summaryWrapper}>
            <h3 className={styles.summaryTitle}>{year}年の予算合計</h3>
            <Suspense fallback={<Skeleton style={{ height: '3rem', width: '80%' }} />}>
              <SummarySection year={year} />
            </Suspense>
          </div>
        </Card>
      </div>

      <BudgetActions />
    </div>
  );
}

function YearSelector({ year, month }: { year: number; month?: number }) {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const getMonthParam = (y: number) => {
    if (month) return `${y}-${String(month).padStart(2, '0')}`;
    return `${y}-01`;
  };

  return (
    <div className={styles.yearSelector}>
      {years.map((y) => (
        <a
          key={y}
          href={`/personal/budget?month=${getMonthParam(y)}`}
          className={`${styles.yearLink} ${y === year ? styles.active : styles.inactive}`}
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
    return <div className={styles.authError}><p>ログインが必要です</p></div>;
  }

  if (budgets.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>予算が設定されていません</p>
        <p className={styles.emptyHint}>下のボタンから予算を追加しましょう</p>
      </div>
    );
  }

  return <BudgetList budgets={budgets} />;
}

async function SummarySection({ year }: { year: number }) {
  const budgets = await getPersonalBudgetsForYear(year);
  const totalAmount = budgets?.reduce((sum, b) => sum + b.amount, 0) ?? 0;

  return <p className={styles.summaryAmount}>¥{totalAmount.toLocaleString()}</p>;
}
