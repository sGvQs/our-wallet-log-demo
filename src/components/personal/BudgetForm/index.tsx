'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { z } from 'zod';
import { PERSONAL_CATEGORIES } from '@/lib/constants/categories';
import { createPersonalBudgets, createBulkPersonalBudgets } from '@/backend/actions/personal-budget';
import { PersonalExpenseCategory } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import styles from '../shared/Form.module.css';

const PersonalExpenseCategoryEnum = z.enum([
  'FOOD', 'HOUSING', 'UTILITIES', 'DAILY', 'TRAVEL', 'ENTERTAINMENT',
  'HOBBY', 'CLOTHING', 'BEAUTY', 'MEDICAL', 'EDUCATION', 'GIFTS',
  'SUBSCRIPTION', 'SAVINGS', 'OTHER',
]);

const budgetSchema = z.object({
  amount: z.number().min(1, '金額は1円以上で入力してください'),
  category: PersonalExpenseCategoryEnum,
  year: z.number().min(2020).max(2100),
  month: z.number().min(1).max(12),
  who: z.string().max(8, '名前は8文字以下で入力してください'),
  description: z.string().max(8, '備考は8文字以下で入力してください'),
  isRecurring: z.boolean(),
  endMonth: z.number().min(1).max(12),
}).refine((data) => {
  // If recurring, endMonth must be >= month
  if (data.isRecurring) {
    return data.endMonth >= data.month;
  }
  return true;
}, {
  message: '終了月は開始月以降を選択してください',
  path: ['endMonth'],
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const FORM_CATEGORIES = Object.entries(PERSONAL_CATEGORIES).filter(
  ([key]) => key !== 'ALL'
) as [PersonalExpenseCategory, string][];

export function BudgetForm({ onSuccess, onCancel }: BudgetFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    control,
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      amount: 0,
      category: 'FOOD',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      isRecurring: false,
      endMonth: 12,
    },
  });

  const isRecurring = useWatch({ control, name: 'isRecurring' });
  const startMonth = useWatch({ control, name: 'month' });

  const onSubmit = handleSubmit((data: BudgetFormData) => {
    startTransition(async () => {
      let result;
      
      if (data.isRecurring && data.endMonth !== undefined) {
        // Create bulk budgets
        result = await createBulkPersonalBudgets(data.year, {
          startMonth: data.month,
          endMonth: data.endMonth,
          category: data.category,
          amount: data.amount,
          who: data.who,
          description: data.description,
        });
      } else {
        // Create single budget
        result = await createPersonalBudgets(data.year, {
          month: data.month,
          category: data.category,
          amount: data.amount,
          who: data.who,
          description: data.description,
        });
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
      <div className={styles.fieldGroup}>
        <label className={styles.label}>{isRecurring ? '開始月' : '対象月'}</label>
        <div className={styles.monthGrid}>
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
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.checkboxLabel}>
          <input type="checkbox" {...register('isRecurring')} className={styles.checkbox} />
          <span>毎月繰り返す（固定費）</span>
        </label>
      </div>

      {isRecurring && (
        <div className={styles.fieldGroup}>
          <label className={styles.label}>終了月</label>
          <select {...register('endMonth', { valueAsNumber: true })} className={styles.select}>
            {Array.from({ length: 12 }, (_, i) => i + 1)
              .filter((m) => m >= startMonth)
              .map((m) => (
                <option key={m} value={m}>{m}月まで</option>
              ))}
          </select>
          {errors.endMonth && <p className={styles.error}>{errors.endMonth.message}</p>}
          <p className={styles.hint}>
            {startMonth}月〜{useWatch({ control, name: 'endMonth' }) ?? 12}月の{(useWatch({ control, name: 'endMonth' }) ?? 12) - startMonth + 1}ヶ月分を一括登録します
          </p>
        </div>
      )}

      <div className={styles.fieldGroup}>
        <label className={styles.label}>カテゴリー</label>
        <select {...register('category')} className={styles.select}>
          {FORM_CATEGORIES.map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>誰と（任意）</label>
        <input {...register('who')} placeholder="メモ" className={styles.input} />
        {errors.who && <p className={styles.error}>{errors.who.message}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>内容（任意）</label>
        <input {...register('description')} placeholder="メモ" className={styles.input} />
        {errors.description && <p className={styles.error}>{errors.description.message}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.label}>予算金額</label>
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
