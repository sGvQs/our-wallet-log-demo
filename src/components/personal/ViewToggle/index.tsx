'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './ViewToggle.module.css';

export type ViewMode = 'monthly' | 'yearly';

interface ViewToggleProps {
  mode: ViewMode;
  year: number;
}

export function ViewToggle({ mode, year }: ViewToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleModeChange = (newMode: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newMode);
    
    if (newMode === 'yearly') {
      params.set('year', year.toString());
      params.delete('month');
    } else {
      // Set to current month when switching to monthly
      const currentMonth = new Date().toISOString().slice(0, 7);
      params.set('month', currentMonth);
      params.delete('year');
      params.delete('view');
    }
    
    router.push(`/personal/dashboard?${params.toString()}`);
  };

  const handleYearChange = (newYear: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', newYear.toString());
    params.set('view', 'yearly');
    router.push(`/personal/dashboard?${params.toString()}`);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className={styles.container}>
      <div className={styles.toggleGroup}>
        <button
          className={`${styles.toggleButton} ${mode === 'monthly' ? styles.toggleButtonActive : ''}`}
          onClick={() => handleModeChange('monthly')}
        >
          月次
        </button>
        <button
          className={`${styles.toggleButton} ${mode === 'yearly' ? styles.toggleButtonActive : ''}`}
          onClick={() => handleModeChange('yearly')}
        >
          年次
        </button>
      </div>
      {mode === 'yearly' && (
          <div className={styles.yearSelector}>
            <span className={styles.yearLabel}>年:</span>
            <select
              className={styles.yearSelect}
              value={year}
              onChange={(e) => handleYearChange(Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}年
                </option>
              ))}
            </select>
          </div>
        )}
    </div>
  );
}
