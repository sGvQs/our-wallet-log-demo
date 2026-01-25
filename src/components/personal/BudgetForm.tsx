'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { z } from 'zod';
import { PERSONAL_CATEGORIES } from '@/lib/constants/categories';
import { createPersonalBudgets } from '@/backend/actions/personal-budget';
import { PersonalExpenseCategory } from '@prisma/client';
import { Loader2 } from 'lucide-react';

// Zod schema for budget
const PersonalExpenseCategoryEnum = z.enum([
  'FOOD',
  'HOUSING',
  'UTILITIES',
  'DAILY',
  'TRAVEL',
  'ENTERTAINMENT',
  'HOBBY',
  'CLOTHING',
  'BEAUTY',
  'MEDICAL',
  'EDUCATION',
  'GIFTS',
  'SUBSCRIPTION',
  'SAVINGS',
  'OTHER',
]);

const budgetSchema = z.object({
  amount: z.number().min(1, '金額は1円以上で入力してください'),
  category: PersonalExpenseCategoryEnum,
  year: z.number().min(2020).max(2100),
  month: z.number().min(1).max(12),
  who: z.string().max(10, '名前は10文字以下で入力してください'),
  description: z.string().max(10, '備考は10文字以下で入力してください'),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Input styles
const inputBaseStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '44px',
  padding: '0.75rem 1rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-bg-app)',
  color: 'var(--color-text-main)',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  fontWeight: 500,
  outline: 'none',
  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
  boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
  WebkitTapHighlightColor: 'transparent',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: '0.5rem',
  display: 'block',
};

const errorStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#dc3545',
  marginTop: '0.35rem',
};

// Categories for the form (excluding ALL)
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
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      amount: 0,
      category: 'FOOD',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    },
  });

  const onSubmit = handleSubmit((data: BudgetFormData) => {
    startTransition(async () => {
      const result = await createPersonalBudgets(data.year, 
        {
          month: data.month,
          category: data.category,
          amount: data.amount,
          who: data.who,
          description: data.description,
        },
      );

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
    <form
      onSubmit={onSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {/* Year & Month Selection */}
      <div>
        <label style={labelStyle}>対象月</label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '0.5rem',
          }}
        >
          <select
            {...register('year', { valueAsNumber: true })}
            style={{ ...inputBaseStyle, cursor: 'pointer' }}
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
            style={{ ...inputBaseStyle, cursor: 'pointer' }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category */}
      <div>
        <label style={labelStyle}>カテゴリー</label>
        <select
          {...register('category')}
          style={{ ...inputBaseStyle, cursor: 'pointer' }}
        >
          {FORM_CATEGORIES.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Who */}
      <div>
        <label style={labelStyle}>誰と（任意）</label>
        <input
          {...register('who')}
          placeholder="メモ"
          style={inputBaseStyle}
        />
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>内容（任意）</label>
        <input
          {...register('description')}
          placeholder="メモ"
          style={inputBaseStyle}
        />
      </div>

      {/* Amount */}
      <div>
        <label style={labelStyle}>予算金額</label>
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            ¥
          </span>
          <input
            type="number"
            {...register('amount', { valueAsNumber: true })}
            placeholder="0"
            style={{
              ...inputBaseStyle,
              paddingLeft: '2rem',
              fontSize: '1.1rem',
              fontWeight: 600,
            }}
          />
        </div>
        {errors.amount && <p style={errorStyle}>{errors.amount.message}</p>}
      </div>

      {/* Error message */}
      {errors.root && (
        <div
          style={{
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(220, 53, 69, 0.08)',
            border: '1px solid rgba(220, 53, 69, 0.2)',
          }}
        >
          <p style={{ color: '#dc3545', fontSize: '0.9rem', margin: 0 }}>
            {errors.root.message}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          style={{
            flex: 1,
            minHeight: '48px',
            padding: '0.875rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'transparent',
            color: 'var(--color-text-main)',
            fontSize: '0.95rem',
            fontWeight: 500,
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isPending}
          style={{
            flex: 1.2,
            minHeight: '48px',
            padding: '0.875rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: 'var(--color-primary-personal)',
            color: '#fff',
            fontSize: '0.95rem',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: isPending ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: `
              0 2px 8px rgba(94, 138, 204, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.15)
            `,
            opacity: isPending ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
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
