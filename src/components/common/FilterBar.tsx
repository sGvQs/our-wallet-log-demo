'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { $Enums } from '@prisma/client';
import styles from './FilterBar.module.css';

interface FilterBarProps {
  category: Record<$Enums.PersonalExpenseCategory, string> | Record<$Enums.ExpenseCategory, string>;
}

export function FilterBar({ category }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentCategory = searchParams.get('category') || 'ALL';

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={`filter-bar ${styles.container}`}>
      <div className={`filter-item ${styles.item}`}>
        <label className={`filter-label ${styles.label}`}>カテゴリー</label>
        <select
          value={currentCategory}
          onChange={handleCategoryChange}
          className={`filter-select ${styles.select}`}
        >
          {Object.entries(category).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
