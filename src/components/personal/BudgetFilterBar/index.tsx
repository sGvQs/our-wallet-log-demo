'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { PERSONAL_CATEGORIES } from '@/lib/constants/categories';
import { PersonalExpenseCategory } from '@prisma/client';
import styles from './BudgetFilterBar.module.css';

const FILTER_CATEGORIES: PersonalExpenseCategory[] = [
  'ALL', 'FOOD', 'HOUSING', 'UTILITIES', 'DAILY', 'TRAVEL', 'ENTERTAINMENT',
  'HOBBY', 'CLOTHING', 'BEAUTY', 'MEDICAL', 'EDUCATION', 'GIFTS',
  'SUBSCRIPTION', 'SAVINGS', 'OTHER',
];

interface BudgetFilterBarProps {
  year: number;
}

export function BudgetFilterBar({ year }: BudgetFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category') || 'ALL';
  const monthParam = searchParams.get('month');
  const currentMonthValue = monthParam ? monthParam.split('-')[1] : 'ALL';

  const handleFilterChange = (key: 'month' | 'category', value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'ALL') {
      params.delete(key);
    } else {
      if (key === 'month') {
        params.set(key, `${year}-${value.padStart(2, '0')}`);
      } else {
        params.set(key, value);
      }
    }

    router.push(`/personal/budget?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label className={styles.label}>月</label>
        <select
          value={currentMonthValue === 'ALL' ? 'ALL' : String(Number(currentMonthValue))}
          onChange={(e) => handleFilterChange('month', e.target.value)}
          className={styles.select}
        >
          <option value="ALL">全て</option>
          {[...Array(12)].map((_, i) => {
            const m = i + 1;
            return (
              <option key={m} value={m.toString()}>
                {m}月
              </option>
            );
          })}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>カテゴリ</label>
        <select
          value={currentCategory}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className={styles.select}
        >
          {FILTER_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'ALL' ? '全て' : PERSONAL_CATEGORIES[cat]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
