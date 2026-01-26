'use client';

import { useTransition, useOptimistic, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PERSONAL_CATEGORIES, PERSONAL_CATEGORY_COLORS } from '@/lib/constants/categories';
import { deletePersonalBudget, updateFuturePersonalBudgets } from '@/backend/actions/personal-budget';
import { PersonalExpenseCategory } from '@prisma/client';
import { Trash2, Pencil, Repeat, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import styles from './BudgetList.module.css';
import formStyles from '../shared/Form.module.css';

interface PersonalBudget {
  id: number;
  amount: number;
  targetMonth: number;
  targetYear: number;
  category: PersonalExpenseCategory;
  who: string | null;
  description: string | null;
  userId: number;
  isRecurring: boolean;
  recurringGroupId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface BudgetListProps {
  budgets: PersonalBudget[];
}

const editSchema = z.object({
  amount: z.number().min(1, '金額は1円以上で入力してください'),
  who: z.string().max(8, '名前は8文字以下で入力してください'),
  description: z.string().max(8, '備考は8文字以下で入力してください'),
  applyToFuture: z.boolean(),
});

type EditFormData = z.infer<typeof editSchema>;

export function BudgetList({ budgets }: BudgetListProps) {
  const [isPending, startTransition] = useTransition();
  const [editingBudget, setEditingBudget] = useState<PersonalBudget | null>(null);

  const [optimisticBudgets, updateOptimistic] = useOptimistic(
    budgets,
    (state, deletedId: number) => state.filter((b) => b.id !== deletedId)
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch,
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
  });

  const applyToFuture = watch('applyToFuture');

  const handleDelete = (budgetId: number) => {
    if (!confirm('この予算を削除しますか？')) return;

    startTransition(async () => {
      updateOptimistic(budgetId);
      await deletePersonalBudget(budgetId);
    });
  };

  const handleEdit = (budget: PersonalBudget) => {
    setEditingBudget(budget);
    reset({
      amount: budget.amount,
      who: budget.who ?? '',
      description: budget.description ?? '',
      applyToFuture: false,
    });
  };

  const onSubmitEdit = handleSubmit((data: EditFormData) => {
    if (!editingBudget) return;

    startTransition(async () => {
      const result = await updateFuturePersonalBudgets(editingBudget.id, {
        amount: data.amount,
        who: data.who || null,
        description: data.description || null,
        applyToFuture: data.applyToFuture,
      });

      if (result?.error) {
        setError('root', { message: result.error });
        return;
      }

      setEditingBudget(null);
      reset();
    });
  });

  const handleCloseEdit = () => {
    setEditingBudget(null);
    reset();
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
    <>
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
                    {budget.isRecurring && (
                      <span className={styles.recurringBadge}>
                        <Repeat size={10} />
                        固定
                      </span>
                    )}
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
                    onClick={() => handleEdit(budget)}
                    className={styles.editButton}
                    aria-label="編集"
                  >
                    <Pencil size={14} />
                  </Button>
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

      <Dialog open={!!editingBudget} onOpenChange={(open) => !open && handleCloseEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>予算を編集</DialogTitle>
            {editingBudget && (
              <DialogDescription>
                {PERSONAL_CATEGORIES[editingBudget.category]} - {editingBudget.targetYear}年{editingBudget.targetMonth}月
              </DialogDescription>
            )}
          </DialogHeader>

          <form onSubmit={onSubmitEdit} className={formStyles.form}>
            <div className={formStyles.fieldGroup}>
              <label className={formStyles.label}>予算金額</label>
              <div className={formStyles.amountWrapper}>
                <span className={formStyles.currencySymbol}>¥</span>
                <input
                  type="number"
                  {...register('amount', { valueAsNumber: true })}
                  placeholder="0"
                  className={formStyles.amountInput}
                />
              </div>
              {errors.amount && <p className={formStyles.error}>{errors.amount.message}</p>}
            </div>

            <div className={formStyles.fieldGroup}>
              <label className={formStyles.label}>誰と（任意）</label>
              <input {...register('who')} placeholder="メモ" className={formStyles.input} />
              {errors.who && <p className={formStyles.error}>{errors.who.message}</p>}
            </div>

            <div className={formStyles.fieldGroup}>
              <label className={formStyles.label}>内容（任意）</label>
              <input {...register('description')} placeholder="メモ" className={formStyles.input} />
              {errors.description && <p className={formStyles.error}>{errors.description.message}</p>}
            </div>

            {editingBudget?.isRecurring && editingBudget?.recurringGroupId && (
              <div className={formStyles.fieldGroup}>
                <label className={formStyles.label}>適用範囲</label>
                <div className={formStyles.radioGroup}>
                  <label className={formStyles.radioLabel}>
                    <input
                      type="radio"
                      className={formStyles.radio}
                      checked={!applyToFuture}
                      onChange={() => reset({ ...watch(), applyToFuture: false })}
                    />
                    <span>この月のみ</span>
                  </label>
                  <label className={formStyles.radioLabel}>
                    <input
                      type="radio"
                      className={formStyles.radio}
                      checked={applyToFuture}
                      onChange={() => reset({ ...watch(), applyToFuture: true })}
                    />
                    <span>この月以降すべて（{editingBudget.targetMonth}月〜12月）</span>
                  </label>
                </div>
              </div>
            )}

            {errors.root && (
              <div className={formStyles.errorBox}>
                <p className={formStyles.errorText}>{errors.root.message}</p>
              </div>
            )}

            <div className={formStyles.buttonGroup}>
              <button type="button" onClick={handleCloseEdit} disabled={isPending} className={formStyles.cancelButton}>
                キャンセル
              </button>
              <button type="submit" disabled={isPending} className={formStyles.submitButton}>
                {isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>処理中...</span>
                  </>
                ) : (
                  <span>更新する</span>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
