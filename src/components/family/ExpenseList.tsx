'use client';

import { deleteExpense } from '@/backend/actions/expenses';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ResponsiveExpenseDialog } from '@/components/expense';
import { useState, useTransition, useOptimistic } from 'react';
import { Pencil } from 'lucide-react';
import type { Expense } from '@/types/prisma';
import { FAMILY_CATEGORIES, FAMILY_CATEGORY_COLORS } from '@/lib/constants/categories';

type ExpenseWithPayer = Expense & {
  payer?: { id: number; name: string | null };
  payerId?: number;
};

export function ExpenseList({
  expenses,
  currentUserId,
}: {
  expenses: ExpenseWithPayer[];
  currentUserId: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Optimistic UI for delete operations
  const [optimisticExpenses, updateOptimistic] = useOptimistic(
    expenses,
    (state, deletedId: string) => state.filter((e) => e.id !== deletedId)
  );

  const handleDelete = (expenseId: string) => {
    startTransition(async () => {
      updateOptimistic(expenseId);
      await deleteExpense(expenseId);
    });
  };

  const handleEditClick = (expense: ExpenseWithPayer) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingExpense(null);
  };

  if (optimisticExpenses.length === 0) {
    return (
      <Card>
        <div
          style={{
            textAlign: 'center',
            padding: '2rem 0',
            color: 'var(--color-text-muted)',
          }}
        >
          <p>まだ支出の記録がありません</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="expense-list">
        {optimisticExpenses.map((expense) => {
          const categoryColor =
            FAMILY_CATEGORY_COLORS[expense.category as keyof typeof FAMILY_CATEGORY_COLORS] ||
            FAMILY_CATEGORY_COLORS.OTHER;
          const categoryLabel =
            FAMILY_CATEGORIES[expense.category as keyof typeof FAMILY_CATEGORIES] || 'その他';
          const canEdit =
            expense.payerId === currentUserId ||
            expense.userId === currentUserId;

          return (
            <Card key={expense.id} className="expense-card">
              <div className="expense-content">
                <div className="expense-info">
                  {expense.payer && (
                    <div
                      style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-bg-app)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-muted)',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        flexShrink: 0,
                      }}
                    >
                      {expense.payer.name ? expense.payer.name[0] : '?'}
                    </div>
                  )}
                  <div
                    className="expense-category-badge"
                    style={{
                      color: categoryColor,
                      background: `${categoryColor}15`,
                    }}
                  >
                    {categoryLabel}
                  </div>
                  {expense.shop && <div className="expense-shop">{expense.shop}</div>}
                  {expense.description && (
                    <div className="expense-description">{expense.description}</div>
                  )}
                </div>
                <div className="expense-actions">
                  <div className="expense-amount">¥{expense.amount.toLocaleString()}</div>
                  {canEdit && (
                    <>
                      <Button
                        variant="ghost"
                        disabled={isPending}
                        onClick={() => handleEditClick(expense)}
                        style={{
                          fontSize: '0.8rem',
                          padding: '0.25rem 0.5rem',
                          color: 'var(--color-text-muted)',
                          opacity: 0.7,
                        }}
                        aria-label="編集"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        disabled={isPending}
                        onClick={() => handleDelete(expense.id)}
                        style={{
                          fontSize: '0.8rem',
                          padding: '0.25rem 0.5rem',
                          color: 'var(--color-accent)',
                          opacity: 0.5,
                        }}
                        aria-label="削除"
                      >
                        ✕
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit Dialog/Drawer */}
      <ResponsiveExpenseDialog
        expense={editingExpense}
        open={isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) handleEditModalClose();
        }}
        onSuccess={handleEditModalClose}
      />
    </>
  );
}
