'use client';

import { deleteExpense } from '@/backend/actions/expenses';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CATEGORIES, CATEGORY_COLORS } from '@/components/FilterBar';
import { useState, useTransition } from 'react';

export function ExpenseList({ expenses, currentUserId }: { expenses: any[], currentUserId: number }) {
  const [isPending, startTransition] = useTransition();

  if (expenses.length === 0) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--color-text-muted)' }}>
          <p>まだ支出の記録がありません</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => {
        const categoryColor = CATEGORY_COLORS[expense.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.OTHER;
        const categoryLabel = CATEGORIES[expense.category as keyof typeof CATEGORIES] || 'その他';

        return (
          <Card key={expense.id} className="expense-card">
            <div className="expense-content">
              <div className="expense-info">
                <div
                  className="expense-category-badge"
                  style={{
                    color: categoryColor,
                    background: `${categoryColor}15`,
                  }}
                >
                  {categoryLabel}
                </div>
                <div className="expense-description">{expense.description}</div>
              </div>
              <div className="expense-actions">
                <div className="expense-amount">
                  ¥{expense.amount.toLocaleString()}
                </div>
                {(expense.payerId === currentUserId || expense.userId === currentUserId) && (
                  <Button
                    variant="ghost"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        await deleteExpense(expense.id);
                      });
                    }}
                    style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', color: 'var(--color-accent)', opacity: 0.5 }}
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  );
}
