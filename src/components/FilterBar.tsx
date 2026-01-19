'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useMonth } from '@/context/MonthContext';
import { ExpenseCategory } from '@prisma/client';


export const CATEGORIES: Record<ExpenseCategory, string> = {
  ALL: 'すべて',
  FOOD: '食費',
  HOUSING: '家賃',
  UTILITIES: '光熱費',
  DAILY: '日用品',
  TRAVEL: '旅行費',
  ENTERTAINMENT: 'お楽しみ費',
  OTHER: 'その他',
};

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  ALL: 'var(--color-text-main)',
  FOOD: '#FF6B6B',
  HOUSING: '#4D96FF',
  UTILITIES: '#FFD93D',
  DAILY: '#6BCB77',
  TRAVEL: '#9D4EDD',
  ENTERTAINMENT: '#FF9F1C',
  OTHER: '#8D99AE',
};

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { month: currentMonth, setMonth } = useMonth();

  const currentCategory = searchParams.get('category') || 'ALL';

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="filter-bar">
      <div className="filter-item">
        <label className="filter-label">つく</label>
        <input
          type="month"
          value={currentMonth}
          onChange={handleMonthChange}
          className="filter-input"
        />
      </div>

      <div className="filter-item">
        <label className="filter-label">カテゴリー</label>
        <select
          value={currentCategory}
          onChange={handleCategoryChange}
          className="filter-select"
        >
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
