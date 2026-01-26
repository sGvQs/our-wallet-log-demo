'use client';

import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import styles from './YearlySummaryCard.module.css';

interface YearlySummaryCardProps {
  year: number;
  yearlyTotalBudget: number;
  yearlyTotalExpenses: number;
  yearlyRemaining: number;
  yearlyUsedPercent: number;
}

export function YearlySummaryCard({
  year,
  yearlyTotalBudget,
  yearlyTotalExpenses,
  yearlyRemaining,
  yearlyUsedPercent,
}: YearlySummaryCardProps) {
  const isOverBudget = yearlyRemaining < 0;

  if (yearlyTotalBudget === 0) {
    return (
      <Card>
        <div className={styles.emptyState}>
          <p className={styles.emptyTitle}>{year}年の予算が設定されていません</p>
          <p className={styles.emptyDescription}>
            予算設定ページから年間予算を登録しましょう
          </p>
          {yearlyTotalExpenses > 0 && (
            <div className={styles.emptyExpenses}>
              <p className={styles.emptyExpensesLabel}>年間支出合計</p>
              <p className={styles.emptyExpensesValue}>
                ¥{yearlyTotalExpenses.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className={styles.header}>
        <p className={styles.title}>年間予算状況</p>
        <span className={styles.yearBadge}>{year}年</span>
      </div>

      <div className={styles.progressWrapper}>
        <ProgressBar
          value={yearlyUsedPercent}
          color={isOverBudget ? '#e74c3c' : yearlyUsedPercent >= 80 ? '#f39c12' : 'var(--color-primary-personal)'}
          showLabel
        />
      </div>

      <div className={styles.statsGrid}>
        <div>
          <p className={styles.statLabel}>年間予算</p>
          <p className={styles.statValue}>¥{yearlyTotalBudget.toLocaleString()}</p>
        </div>
        <div>
          <p className={styles.statLabel}>年間支出</p>
          <p className={styles.statValue}>¥{yearlyTotalExpenses.toLocaleString()}</p>
        </div>
      </div>

      <div className={`${styles.remainingBox} ${isOverBudget ? styles.remainingBoxNegative : styles.remainingBoxPositive}`}>
        <span className={styles.remainingLabel}>
          {isOverBudget ? '超過額' : '残り予算'}
        </span>
        <span className={`${styles.remainingValue} ${isOverBudget ? styles.remainingValueNegative : styles.remainingValuePositive}`}>
          ¥{Math.abs(yearlyRemaining).toLocaleString()}
        </span>
      </div>
    </Card>
  );
}
