'use client';

import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useMonth } from '@/context/MonthContext';

export function MonthNav() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { month: activeMonth, setMonth } = useMonth();
  
  if (pathname.includes('/settings')) return null;
  if (pathname.includes('/budget')) return null;

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
    <nav className="month-nav">
      <div className="mobile-month-display">
        {activeMonth.split('-')[0]}年 {parseInt(activeMonth.split('-')[1])}月
      </div>
      <h3 className="month-nav-title">
        月を選択
      </h3>
      {months.map((month) => {
        const isActive = activeMonth === month.value;
        // Construct new params: keep category, change month
        const newParams = new URLSearchParams(searchParams);
        newParams.set('yearAndMonth', month.value);

        return (
          <button
            key={month.value}
            onClick={() => setMonth(month.value)}
            className="month-nav-link"
            style={{
              background: isActive ? 'var(--color-bg-surface)' : 'transparent',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
              fontWeight: isActive ? 600 : 400,
              border: isActive ? '1px solid var(--color-border)' : '1px solid transparent',
            }}
          >
            {month.label}
          </button>
        );
      })}
    </nav>
  );
}
