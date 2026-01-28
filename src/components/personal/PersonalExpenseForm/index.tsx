'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { z } from 'zod';
import { PERSONAL_CATEGORIES } from '@/lib/constants/categories';
import { addPersonalExpense, updatePersonalExpense } from '@/backend/actions/personal-expenses';
import { PersonalExpenseCategory } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import styles from '../shared/Form.module.css';

const PersonalExpenseCategoryEnum = z.enum([
  'FOOD', 'HOUSING', 'UTILITIES', 'DAILY', 'TRAVEL', 'ENTERTAINMENT',
  'HOBBY', 'CLOTHING', 'BEAUTY', 'MEDICAL', 'EDUCATION', 'GIFTS',
  'SUBSCRIPTION', 'SAVINGS', 'OTHER',
]);

const personalExpenseSchema = z.object({
  amount: z.number().min(1, '金額は1円以上で入力してください'),
  description: z.string().max(100).optional(),
  shop: z.string().max(100).optional(),
  category: PersonalExpenseCategoryEnum,
  year: z.number().min(2020).max(2100),
  month: z.number().min(1).max(12),
  day: z.number().min(1).max(31),
});

type PersonalExpenseFormData = z.infer<typeof personalExpenseSchema>;

export interface PersonalExpense {
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

interface PersonalExpenseFormProps {
  expense?: PersonalExpense;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const FORM_CATEGORIES = Object.entries(PERSONAL_CATEGORIES).filter(
  ([key]) => key !== 'ALL'
) as [PersonalExpenseCategory, string][];

export function PersonalExpenseForm({ expense, onSuccess, onCancel }: PersonalExpenseFormProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!expense;

  const getDefaultValues = (): PersonalExpenseFormData => {
    if (expense) {
      const date = new Date(expense.date);
      return {
        amount: expense.amount,
        description: expense.description || '',
        shop: expense.shop || '',
        category: expense.category as z.infer<typeof PersonalExpenseCategoryEnum>,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    }
    return {
      amount: 0,
      description: '',
      shop: '',
      category: 'FOOD',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<PersonalExpenseFormData>({
    resolver: zodResolver(personalExpenseSchema),
    defaultValues: getDefaultValues(),
  });

  const onSubmit = handleSubmit((data: PersonalExpenseFormData) => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append('amount', data.amount.toString());
      formData.append('description', data.description || '');
      formData.append('shop', data.shop || '');
      formData.append('category', data.category);
      formData.append('year', data.year.toString());
      formData.append('month', data.month.toString());
      formData.append('day', data.day.toString());

      const result = isEditing
        ? await updatePersonalExpense(expense.id, formData)
        : await addPersonalExpense(null, formData);

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
      <div className={styles.fieldGroup}>
        <label className={styles.label}>日付</label>
        <div className={styles.dateGrid}>
          <select {...register('year', { valueAsNumber: true })} className={styles.select}>
            {[new Date().getFullYear() - 1, new Date().getFullYear(), new Date().getFullYear() + 1].map((y) => (
              <option key={y} value={y}>{y}年</option>
            ))}
          </select>
          <select {...register('month', { valueAsNumber: true })} className={styles.select}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>{m}月</option>
            ))}
          </select>
          <select {...register('day', { valueAsNumber: true })} className={styles.select}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>{d}日</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>お店の名前</label>
        <input {...register('shop')} placeholder="お店の名前" className={styles.input} />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>内容（任意）</label>
        <input {...register('description')} placeholder="メモ" className={styles.input} />
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>カテゴリー</label>
        <select {...register('category')} className={styles.select}>
          {FORM_CATEGORIES.map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

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

      {errors.root && (
        <div className={styles.errorBox}>
          <p className={styles.errorText}>{errors.root.message}</p>
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button type="button" onClick={handleCancel} disabled={isPending} className={styles.cancelButton}>
          キャンセル
        </button>
        <button type="submit" disabled={isPending} className={styles.submitButton}>
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>処理中...</span>
            </>
          ) : (
            <span>保存する</span>
          )}
        </button>
      </div>
    </form>
  );
}
