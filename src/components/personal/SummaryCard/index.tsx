'use client';

import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import styles from './SummaryCard.module.css';

interface SummaryCardProps {
  totalBudget: number;
  totalExpenses: number;
  budgetUsedPercent: number;
  month: string;
}

export function SummaryCard({
  totalBudget,
  totalExpenses,
  budgetUsedPercent,
  month,
}: SummaryCardProps) {
  const remaining = totalBudget - totalExpenses;
  const isOverBudget = remaining < 0;
  const hasBudget = totalBudget > 0;

  const formatMonth = (m: string) => {
    const [year, month] = m.split('-');
    return `${year}年${parseInt(month)}月`;
  };

  return (
    <Card>
      <div className={styles.header}>
        <h3 className={styles.title}>{formatMonth(month)} の予算状況</h3>

        {hasBudget ? (
          <>
            <div className={styles.progressWrapper}>
              <ProgressBar
                value={totalExpenses}
                max={totalBudget}
                showLabel={true}
                labelPosition="outside"
                height="1rem"
              />
            </div>

            <div className={styles.statsGrid}>
              <div>
                <p className={styles.statLabel}>予算</p>
                <p className={styles.statValue}>¥{totalBudget.toLocaleString()}</p>
              </div>
              <div>
                <p className={styles.statLabel}>支出</p>
                <p className={styles.statValue}>¥{totalExpenses.toLocaleString()}</p>
              </div>
            </div>

            <div className={`${styles.remainingBox} ${isOverBudget ? styles.negative : styles.positive}`}>
              {isOverBudget ? (
                <AlertTriangle size={18} color="#e74c3c" />
              ) : remaining < totalBudget * 0.2 ? (
                <TrendingDown size={18} color="#f39c12" />
              ) : (
                <TrendingUp size={18} color="var(--color-primary-personal)" />
              )}
              <div>
                <p className={styles.remainingLabel}>
                  {isOverBudget ? '予算超過' : '残り予算'}
                </p>
                <p className={`${styles.remainingValue} ${isOverBudget ? styles.negative : styles.positive}`}>
                  {isOverBudget ? '-' : ''}¥{Math.abs(remaining).toLocaleString()}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>予算が設定されていません</p>
            <p className={styles.emptyDescription}>
              「予算設定」から今月の予算を設定しましょう
            </p>

            <div className={styles.emptyExpenses}>
              <p className={styles.emptyExpensesLabel}>今月の支出</p>
              <p className={styles.emptyExpensesValue}>
                ¥{totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
