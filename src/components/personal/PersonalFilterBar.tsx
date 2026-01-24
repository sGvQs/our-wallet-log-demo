'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMonth } from '@/context/MonthContext';
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

export function PersonalFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { month } = useMonth();

  const currentCategory = searchParams.get('category') || 'ALL';

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'ALL') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    if (month) {
      params.set('month', month);
    }
    router.push(`/personal/expenses?${params.toString()}`);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        flexWrap: 'wrap',
      }}
    >
      {FILTER_CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => handleCategoryChange(cat)}
          style={{
            padding: '0.375rem 0.75rem',
            fontSize: '0.8rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border)',
            background:
              currentCategory === cat
                ? 'var(--color-primary-personal)'
                : 'transparent',
            color:
              currentCategory === cat ? 'white' : 'var(--color-text-muted)',
            cursor: 'pointer',
            transition: 'all var(--transition-base)',
            fontWeight: 500,
          }}
        >
          {PERSONAL_CATEGORIES[cat]}
        </button>
      ))}
    </div>
  );
}
