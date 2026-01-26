'use client';

import { Card } from '@/components/ui/Card';
import { PERSONAL_CATEGORIES, PERSONAL_CATEGORY_COLORS } from '@/lib/constants/categories';
import type { CategoryBudgetComparison } from '@/backend/services/personal-data';
import styles from './CategoryBudgetCard.module.css';

interface CategoryBudgetCardProps {
  comparisons: CategoryBudgetComparison[];
}

export function CategoryBudgetCard({ comparisons }: CategoryBudgetCardProps) {
  if (comparisons.length === 0) {
    return (
      <Card>
        <h3 className={styles.title}>カテゴリー別 予算 vs 支出</h3>
        <div className={styles.emptyState}>
          <p>予算または支出がありません</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className={styles.title}>カテゴリー別 予算 vs 支出</h3>
      <div className={styles.list}>
        {comparisons.map((item) => {
          const color = PERSONAL_CATEGORY_COLORS[item.category] || '#888';
          const categoryLabel = PERSONAL_CATEGORIES[item.category];
          const remaining = item.budgetAmount - item.expenseAmount;
          
          // Determine status
          const isWarning = item.usedPercent !== null && item.usedPercent >= 80 && item.usedPercent < 100;
          const isOver = item.isOverBudget;
          
          // Bar width (cap at 100% for visual)
          const barWidth = item.usedPercent !== null 
            ? Math.min(item.usedPercent, 100) 
            : 0;

          return (
            <div key={item.category} className={styles.item}>
              <div className={styles.itemHeader}>
                <div className={styles.labelGroup}>
                  <span className={styles.colorDot} style={{ backgroundColor: color }} />
                  <span className={styles.categoryName}>{categoryLabel}</span>
                  {isOver && (
                    <span className={`${styles.statusBadge} ${styles.statusOverBudget}`}>
                      予算超過
                    </span>
                  )}
                  {isWarning && (
                    <span className={`${styles.statusBadge} ${styles.statusWarning}`}>
                      注意
                    </span>
                  )}
                  {!item.hasBudget && (
                    <span className={`${styles.statusBadge} ${styles.statusNoBudget}`}>
                      予算未設定
                    </span>
                  )}
                </div>
                {item.usedPercent !== null && (
                  <span className={`${styles.percentText} ${
                    isOver ? styles.percentOver : isWarning ? styles.percentWarning : styles.percentNormal
                  }`}>
                    {item.usedPercent}%
                  </span>
                )}
              </div>

              {item.hasBudget && (
                <div className={styles.barContainer}>
                  <div
                    className={`${styles.barFill} ${
                      isOver ? styles.barOver : isWarning ? styles.barWarning : styles.barNormal
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              )}

              <div className={styles.detailRow}>
                <span className={styles.expenseAmount}>
                  ¥{item.expenseAmount.toLocaleString()}
                  {item.hasBudget && (
                    <span className={styles.budgetAmount}>
                      {' '}/ ¥{item.budgetAmount.toLocaleString()}
                    </span>
                  )}
                </span>
                {item.hasBudget && (
                  <span className={remaining >= 0 ? styles.remainingPositive : styles.remainingNegative}>
                    {remaining >= 0 ? `残り: ¥${remaining.toLocaleString()}` : `超過: ¥${Math.abs(remaining).toLocaleString()}`}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
