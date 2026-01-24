'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { PERSONAL_CATEGORIES } from '@/lib/constants/personal-categories';
import { PersonalExpenseCategory } from '@prisma/client';

// Filter categories (including ALL)
const FILTER_CATEGORIES: PersonalExpenseCategory[] = [
  'ALL',
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
];

interface BudgetFilterBarProps {
  year: number;
}

export function BudgetFilterBar({ year }: BudgetFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentMonth = searchParams.get('month') || 'ALL';
  const currentCategory = searchParams.get('category') || 'ALL';

  const handleMonthChange = (month: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', year.toString());
    if (month === 'ALL') {
      params.delete('month');
    } else {
      params.set('month', month);
    }
    router.push(`/personal/budget?${params.toString()}`);
  };

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', year.toString());
    if (category === 'ALL') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    router.push(`/personal/budget?${params.toString()}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Month filter */}
      <div>
        <label
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            display: 'block',
            marginBottom: '0.375rem',
          }}
        >
          月
        </label>
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleMonthChange('ALL')}
            style={{
              padding: '0.25rem 0.625rem',
              fontSize: '0.8rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--color-border)',
              background: currentMonth === 'ALL' ? 'var(--color-primary-personal)' : 'transparent',
              color: currentMonth === 'ALL' ? 'white' : 'var(--color-text-muted)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            全て
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
            <button
              key={m}
              onClick={() => handleMonthChange(m.toString())}
              style={{
                padding: '0.25rem 0.5rem',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                background: currentMonth === m.toString() ? 'var(--color-primary-personal)' : 'transparent',
                color: currentMonth === m.toString() ? 'white' : 'var(--color-text-muted)',
                cursor: 'pointer',
                fontWeight: 500,
                minWidth: '32px',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div>
        <label
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-text-muted)',
            display: 'block',
            marginBottom: '0.375rem',
          }}
        >
          カテゴリ
        </label>
        <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              style={{
                padding: '0.25rem 0.625rem',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                background: currentCategory === cat ? 'var(--color-primary-personal)' : 'transparent',
                color: currentCategory === cat ? 'white' : 'var(--color-text-muted)',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              {PERSONAL_CATEGORIES[cat]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
