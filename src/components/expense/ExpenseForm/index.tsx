'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import {
  expenseFormSchema,
  type ExpenseFormData,
  defaultExpenseFormValues,
} from '@/lib/validations/expense';
import { addExpense, updateExpense } from '@/backend/actions/expenses';
import type { Expense } from '@/types/prisma';
import { Loader2 } from 'lucide-react';
import { FAMILY_CATEGORIES } from '@/lib/constants/categories';
import styles from './ExpenseForm.module.css';

export type ExpenseFormProps = {
  mode: 'create' | 'edit';
  initialData?: Expense | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function ExpenseForm({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: ExpenseFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: initialData
      ? {
          amount: initialData.amount,
          description: initialData.description ?? '',
          shop: initialData.shop ?? '',
          category: initialData.category as ExpenseFormData['category'],
          year: new Date(initialData.date).getFullYear(),
          month: new Date(initialData.date).getMonth() + 1,
          day: new Date(initialData.date).getDate(),
        }
      : defaultExpenseFormValues,
  });

  const onSubmit = handleSubmit((data: ExpenseFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('amount', data.amount.toString());
      formData.append('description', data.description);
      formData.append('shop', data.shop);
      formData.append('category', data.category);
      formData.append('year', data.year.toString());
      formData.append('month', data.month.toString());
      formData.append('day', data.day.toString());

      let result;
      if (mode === 'edit' && initialData) {
        result = await updateExpense(initialData.id, formData);
      } else {
        result = await addExpense(null, formData);
      }

      if (result?.error) {
        setError('root', { message: result.error });
        return;
      }

      reset();
      onSuccess?.();
    });
  });

  const handleCancel = () => {
    reset();
    onCancel?.();
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {/* Date Selection */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>日付</label>
        <div className={styles.dateGrid}>
          <select
            {...register('year', { valueAsNumber: true })}
            className={styles.select}
          >
            {[
              new Date().getFullYear() - 1,
              new Date().getFullYear(),
              new Date().getFullYear() + 1,
            ].map((y) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </select>
          <select
            {...register('month', { valueAsNumber: true })}
            className={styles.select}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </select>
          <select
            {...register('day', { valueAsNumber: true })}
            className={styles.select}
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {d}日
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shop */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>お店の名前</label>
        <input
          {...register('shop')}
          placeholder="お店の名前"
          className={styles.input}
        />
        {errors.shop && <p className={styles.error}>{errors.shop.message}</p>}
      </div>

      {/* Description */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>内容</label>
        <input
          {...register('description')}
          placeholder="食料品"
          className={styles.input}
        />
        {errors.description && (
          <p className={styles.error}>{errors.description.message}</p>
        )}
      </div>

      {/* Category */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>カテゴリー</label>
        <select {...register('category')} className={styles.select}>
          {Object.entries(FAMILY_CATEGORIES)
            .filter(([key]) => key !== 'ALL')
            .map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
        </select>
        {errors.category && (
          <p className={styles.error}>{errors.category.message}</p>
        )}
      </div>

      {/* Amount */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>金額</label>
        <div className={styles.amountWrapper}>
          <span className={styles.currencySymbol}>¥</span>
          <input
            type="number"
            {...register('amount', { valueAsNumber: true })}
            placeholder="0"
            className={styles.amountInput}
          />
        </div>
        {errors.amount && <p className={styles.error}>{errors.amount.message}</p>}
      </div>

      {/* Error message */}
      {errors.root && (
        <div className={styles.errorBox}>
          <p className={styles.errorText}>{errors.root.message}</p>
        </div>
      )}

      {/* Action buttons */}
      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className={styles.cancelButton}
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isPending}
          className={styles.submitButton}
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>処理中...</span>
            </>
          ) : (
            <span>{mode === 'edit' ? '更新する' : '保存する'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
