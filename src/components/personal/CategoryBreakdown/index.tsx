'use client';

import { Card } from '@/components/ui/Card';
import { PERSONAL_CATEGORIES, PERSONAL_CATEGORY_COLORS } from '@/lib/constants/categories';
import { PersonalExpenseCategory } from '@prisma/client';
import styles from './CategoryBreakdown.module.css';

interface CategorySummary {
  category: PersonalExpenseCategory;
  total: number;
  count: number;
}

interface CategoryBreakdownProps {
  categorySummary: CategorySummary[];
  totalExpenses: number;
}

export function CategoryBreakdown({ categorySummary, totalExpenses }: CategoryBreakdownProps) {
  if (categorySummary.length === 0) {
    return (
      <Card>
        <h3 className={styles.title}>カテゴリ別内訳</h3>
        <div className={styles.emptyState}>
          <p>まだ支出がありません</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className={styles.title}>カテゴリ別内訳</h3>
      <div className={styles.list}>
        {categorySummary.map((item) => {
          const percentage = totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0;
          const color = PERSONAL_CATEGORY_COLORS[item.category] || '#888';

          return (
            <div key={item.category}>
              <div className={styles.itemHeader}>
                <div className={styles.labelGroup}>
                  <span className={styles.colorDot} style={{ backgroundColor: color }} />
                  <span className={styles.categoryName}>
                    {PERSONAL_CATEGORIES[item.category]}
                  </span>
                  <span className={styles.count}>({item.count}件)</span>
                </div>
                <span className={styles.amount}>¥{item.total.toLocaleString()}</span>
              </div>
              <div className={styles.barContainer}>
                <div
                  className={styles.barFill}
                  style={{ width: `${percentage}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
