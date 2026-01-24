'use client';

import { useState, useTransition, useOptimistic } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PERSONAL_CATEGORIES, CATEGORY_COLORS } from '@/lib/constants/personal-categories';
import { deletePersonalExpense } from '@/backend/actions/personal-expenses';
import { PersonalExpenseCategory } from '@prisma/client';
import { Pencil, Trash2 } from 'lucide-react';

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
  
  // Optimistic UI for delete
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
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <p>まだ支出の記録がありません</p>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {optimisticExpenses.map((expense) => {
        const categoryColor = CATEGORY_COLORS[expense.category] || '#888';
        const categoryLabel = PERSONAL_CATEGORIES[expense.category];
        const dateStr = new Date(expense.date).toLocaleDateString('ja-JP', {
          month: 'short',
          day: 'numeric',
        });

        return (
          <Card key={expense.id} className="expense-card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              {/* Left: Category, Shop, Description */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.25rem',
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.125rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: `${categoryColor}15`,
                      color: categoryColor,
                      fontWeight: 500,
                    }}
                  >
                    {categoryLabel}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {dateStr}
                  </span>
                </div>
                {expense.shop && (
                  <p
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: 'var(--color-text-main)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {expense.shop}
                  </p>
                )}
                {expense.description && (
                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-text-muted)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {expense.description}
                  </p>
                )}
              </div>

              {/* Right: Amount and actions */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'var(--color-text-main)',
                  }}
                >
                  ¥{expense.amount.toLocaleString()}
                </span>
                <Button
                  variant="ghost"
                  disabled={isPending}
                  onClick={() => handleDelete(expense.id)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    color: 'var(--color-text-muted)',
                    opacity: 0.5,
                  }}
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
