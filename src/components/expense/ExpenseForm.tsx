'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { CATEGORIES } from '@/components/FilterBar';
import {
  expenseFormSchema,
  type ExpenseFormData,
  defaultExpenseFormValues,
} from '@/lib/validations/expense';
import { addExpense, updateExpense } from '@/backend/actions/expenses';
import type { Expense } from '@/types/prisma';
import { Loader2 } from 'lucide-react';

export type ExpenseFormProps = {
  mode: 'create' | 'edit';
  initialData?: Expense | null;
  onSuccess?: () => void;
  onCancel?: () => void;
};

// Neumorphic input styles
const inputBaseStyle: React.CSSProperties = {
  width: '100%',
  minHeight: '44px', // Ensure 44px+ tap target for mobile accessibility
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
  WebkitTapHighlightColor: 'transparent', // Remove tap highlight on mobile
};

const inputFocusStyle: React.CSSProperties = {
  borderColor: 'var(--color-primary)',
  boxShadow: `
    inset 0 1px 2px rgba(0, 0, 0, 0.04),
    0 0 0 3px rgba(217, 119, 87, 0.12)
  `,
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
      formData.append("shop", data.shop);
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

  // Focus handler for input elements
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    Object.assign(e.target.style, inputFocusStyle);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.target.style.borderColor = 'var(--color-border)';
    e.target.style.boxShadow = 'inset 0 1px 2px rgba(0, 0, 0, 0.04)';
  };

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Date Selection */}
      <div>
        <label style={labelStyle}>日付</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '0.5rem' }}>
          <select
            {...register('year', { valueAsNumber: true })}
            style={{ ...inputBaseStyle, cursor: 'pointer' }}
            onFocus={handleFocus as any}
            onBlur={handleBlur as any}
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
            onFocus={handleFocus as any}
            onBlur={handleBlur as any}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}月
              </option>
            ))}
          </select>
          <select
            {...register('day', { valueAsNumber: true })}
            style={{ ...inputBaseStyle, cursor: 'pointer' }}
            onFocus={handleFocus as any}
            onBlur={handleBlur as any}
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
      <div>
        <label style={labelStyle}>お店の名前</label>
        <input
          {...register('shop')}
          placeholder="お店の名前"
          style={inputBaseStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {errors.shop && (
          <p style={errorStyle}>{errors.shop.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>内容</label>
        <input
          {...register('description')}
          placeholder="食料品"
          style={inputBaseStyle}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {errors.description && (
          <p style={errorStyle}>{errors.description.message}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label style={labelStyle}>カテゴリー</label>
        <select
          {...register('category')}
          style={{ ...inputBaseStyle, cursor: 'pointer' }}
          onFocus={handleFocus as any}
          onBlur={handleBlur as any}
        >
          {Object.entries(CATEGORIES)
            .filter(([key]) => key !== 'ALL')
            .map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
        </select>
        {errors.category && (
          <p style={errorStyle}>{errors.category.message}</p>
        )}
      </div>

      {/* Amount - Highlighted input */}
      <div>
        <label style={labelStyle}>金額</label>
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
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
        {errors.amount && (
          <p style={errorStyle}>{errors.amount.message}</p>
        )}
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
            minHeight: '48px', // Ensure 44px+ tap target for accessibility
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
            WebkitTapHighlightColor: 'transparent', // Remove tap highlight on mobile
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isPending}
          style={{
            flex: 1.2,
            minHeight: '48px', // Ensure 44px+ tap target for accessibility
            padding: '0.875rem 1rem',
            borderRadius: 'var(--radius-sm)',
            border: 'none',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            fontSize: '0.95rem',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: isPending ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: `
              0 2px 8px rgba(217, 119, 87, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.15)
            `,
            opacity: isPending ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            WebkitTapHighlightColor: 'transparent', // Remove tap highlight on mobile
          }}
          onMouseEnter={(e) => {
            if (!isPending) {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = `
                0 4px 12px rgba(217, 119, 87, 0.35),
                inset 0 1px 0 rgba(255, 255, 255, 0.15)
              `;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `
              0 2px 8px rgba(217, 119, 87, 0.25),
              inset 0 1px 0 rgba(255, 255, 255, 0.15)
            `;
          }}
          onMouseDown={(e) => {
            if (!isPending) {
              e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
            }
          }}
          onMouseUp={(e) => {
            if (!isPending) {
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
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
