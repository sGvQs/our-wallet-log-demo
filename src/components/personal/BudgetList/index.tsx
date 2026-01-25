'use client';

import { useTransition, useOptimistic } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PERSONAL_CATEGORIES, PERSONAL_CATEGORY_COLORS } from '@/lib/constants/categories';
import { deletePersonalBudget } from '@/backend/actions/personal-budget';
import { PersonalExpenseCategory } from '@prisma/client';
import { Trash2 } from 'lucide-react';
import styles from './BudgetList.module.css';

interface PersonalBudget {
  id: number;
  amount: number;
  targetMonth: number;
  targetYear: number;
  category: PersonalExpenseCategory;
  who: string | null;
  description: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BudgetListProps {
  budgets: PersonalBudget[];
}

export function BudgetList({ budgets }: BudgetListProps) {
  const [isPending, startTransition] = useTransition();

  const [optimisticBudgets, updateOptimistic] = useOptimistic(
    budgets,
    (state, deletedId: number) => state.filter((b) => b.id !== deletedId)
  );

  const handleDelete = (budgetId: number) => {
    if (!confirm('この予算を削除しますか？')) return;

    startTransition(async () => {
      updateOptimistic(budgetId);
      await deletePersonalBudget(budgetId);
    });
  };

  if (optimisticBudgets.length === 0) {
    return (
      <Card>
        <div className={styles.emptyState}>
          <p>まだ予算が設定されていません</p>
          <p className={styles.emptyDescription}>
            下のボタンから予算を追加しましょう
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className={styles.container}>
      {optimisticBudgets.map((budget) => {
        const categoryColor = PERSONAL_CATEGORY_COLORS[budget.category] || '#888';
        const categoryLabel = PERSONAL_CATEGORIES[budget.category];

        return (
          <Card key={budget.id} className="budget-card">
            <div className={styles.cardContent}>
              <div
                className={styles.colorIndicator}
                style={{ backgroundColor: categoryColor }}
              />

              <div className={styles.info}>
                <div className={styles.badges}>
                  <span
                    className={styles.badge}
                    style={{
                      background: `${categoryColor}15`,
                      color: categoryColor,
                    }}
                  >
                    {categoryLabel}
                  </span>
                  {budget.who && (
                    <span
                      className={styles.badge}
                      style={{
                        background: `${categoryColor}15`,
                        color: categoryColor,
                      }}
                    >
                      {budget.who}
                    </span>
                  )}
                  {budget.description && (
                    <span
                      className={styles.badge}
                      style={{
                        background: `${categoryColor}15`,
                        color: categoryColor,
                      }}
                    >
                      {budget.description}
                    </span>
                  )}
                </div>
                <p className={styles.monthYear}>
                  {budget.targetYear}年{budget.targetMonth}月
                </p>
              </div>

              <div className={styles.actions}>
                <span className={styles.amount}>
                  ¥{budget.amount.toLocaleString()}
                </span>
                <Button
                  variant="ghost"
                  disabled={isPending}
                  onClick={() => handleDelete(budget.id)}
                  className={styles.deleteButton}
                  aria-label="削除"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
