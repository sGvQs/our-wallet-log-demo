'use client';

import { useTransition, useOptimistic } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PERSONAL_CATEGORIES, PERSONAL_CATEGORY_COLORS } from '@/lib/constants/categories';
import { deletePersonalExpense } from '@/backend/actions/personal-expenses';
import { PersonalExpenseCategory } from '@prisma/client';
import { Trash2 } from 'lucide-react';
import styles from './PersonalExpenseList.module.css';

interface PersonalExpense {
  id: string;
  amount: number;
  description: string | null;
  shop: string | null;
  date: Date;
  category: PersonalExpenseCategory;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PersonalExpenseListProps {
  expenses: PersonalExpense[];
}

export function PersonalExpenseList({ expenses }: PersonalExpenseListProps) {
  const [isPending, startTransition] = useTransition();

  const [optimisticExpenses, updateOptimistic] = useOptimistic(
    expenses,
    (state, deletedId: string) => state.filter((e) => e.id !== deletedId)
  );

  const handleDelete = (expenseId: string) => {
    if (!confirm('この支出を削除しますか？')) return;

    startTransition(async () => {
      updateOptimistic(expenseId);
      await deletePersonalExpense(expenseId);
    });
  };

  if (optimisticExpenses.length === 0) {
    return (
      <Card>
        <div className={styles.emptyState}>
          <p>まだ支出の記録がありません</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={styles.container}>
      {optimisticExpenses.map((expense) => {
        const categoryColor = PERSONAL_CATEGORY_COLORS[expense.category] || '#888';
        const categoryLabel = PERSONAL_CATEGORIES[expense.category];
        const dateStr = new Date(expense.date).toLocaleDateString('ja-JP', {
          month: 'short',
          day: 'numeric',
        });

        return (
          <Card key={expense.id} className="expense-card">
            <div className={styles.cardContent}>
              <div className={styles.info}>
                <div className={styles.infoHeader}>
                  <span
                    className={styles.badge}
                    style={{
                      background: `${categoryColor}15`,
                      color: categoryColor,
                    }}
                  >
                    {categoryLabel}
                  </span>
                  <span className={styles.date}>{dateStr}</span>
                </div>
                {expense.shop && <p className={styles.shop}>{expense.shop}</p>}
                {expense.description && (
                  <p className={styles.description}>{expense.description}</p>
                )}
              </div>

              <div className={styles.actions}>
                <span className={styles.amount}>¥{expense.amount.toLocaleString()}</span>
                <Button
                  variant="ghost"
                  disabled={isPending}
                  onClick={() => handleDelete(expense.id)}
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
