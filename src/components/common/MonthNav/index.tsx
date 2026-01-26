'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import { useMonth } from '@/context/MonthContext';
import styles from './MonthNav.module.css';

export function MonthNav() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { month: activeMonth, setMonth } = useMonth();

  // Hide on settings and budget pages
  if (pathname.includes('/settings')) return null;
  if (pathname.includes('/budget')) return null;
  if(searchParams.toString().includes("view=yearly")) return null;

  // Default to current month if not specified
  const now = new Date();
  const currentY = now.getFullYear();
  const currentM = now.getMonth() + 1;

  // Generate last 12 months
  const months = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(currentY, currentM - 1 - i, 1);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const value = `${y}-${String(m).padStart(2, '0')}`;
    const label = `${y}年${m}月`;
    months.push({ value, label });
  }

  return (
    <nav className={styles.container}>
      <h3 className={styles.title}>月を選択</h3>
      {months.map((month) => {
        const isActive = activeMonth === month.value;
        const buttonClass = isActive 
          ? `${styles.link} ${styles.active}` 
          : styles.link;

        return (
          <button
            key={month.value}
            onClick={() => setMonth(month.value)}
            className={buttonClass}
          >
            {month.label}
          </button>
        );
      })}
    </nav>
  );
}
