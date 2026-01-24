'use client';

import { useState, useTransition, useOptimistic } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PERSONAL_CATEGORIES, CATEGORY_COLORS } from '@/lib/constants/personal-categories';
import { deletePersonalBudget } from '@/backend/actions/personal-budget';
import { PersonalExpenseCategory } from '@prisma/client';
import { Trash2 } from 'lucide-react';

interface PersonalBudget {
  id: number;
  amount: number;
  targetMonth: number;
  targetYear: number;
  category: PersonalExpenseCategory;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BudgetListProps {
  budgets: PersonalBudget[];
}

export function BudgetList({ budgets }: BudgetListProps) {
  const [isPending, startTransition] = useTransition();

  // Optimistic UI for delete
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
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <p>まだ予算が設定されていません</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
            下のボタンから予算を追加しましょう
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {optimisticBudgets.map((budget) => {
        const categoryColor = CATEGORY_COLORS[budget.category] || '#888';
        const categoryLabel = PERSONAL_CATEGORIES[budget.category];

        return (
          <Card key={budget.id} className="budget-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              {/* Category color indicator */}
              <div
                style={{
                  width: '4px',
                  height: '48px',
                  borderRadius: '2px',
                  backgroundColor: categoryColor,
                  flexShrink: 0,
                }}
              />

              {/* Category & Month info */}
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
                </div>
                <p
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: 'var(--color-text-main)',
                  }}
                >
                  {budget.targetYear}年{budget.targetMonth}月
                </p>
              </div>

              {/* Amount and actions */}
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
                    color: 'var(--color-primary-personal)',
                  }}
                >
                  ¥{budget.amount.toLocaleString()}
                </span>
                <Button
                  variant="ghost"
                  disabled={isPending}
                  onClick={() => handleDelete(budget.id)}
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
