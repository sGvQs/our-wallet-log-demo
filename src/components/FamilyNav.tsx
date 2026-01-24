'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMonth } from '@/context/MonthContext';

export function FamilyNav() {
  const pathname = usePathname();
  const { month } = useMonth();

  const isExpenses = pathname.includes('/family/expenses');
  const isGroup = pathname.includes('/family/group');
  const isSettings = pathname.includes('/family/settings');

  return (
    <div className="dashboard-nav-container">
      <div className="dashboard-nav-content">
        <Link 
            href={`/family/expenses?month=${month}`} 
            className="dashboard-nav-link"
            style={{ 
                color: isExpenses ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottomColor: isExpenses ? 'var(--color-primary)' : 'transparent',
            }}
        >
            自分の家計簿
        </Link>
        <Link 
            href={`/family/group?month=${month}`} 
            className="dashboard-nav-link"
            style={{ 
                color: isGroup ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottomColor: isGroup ? 'var(--color-primary)' : 'transparent',
            }}
        >
             チームの出費
        </Link>
        <Link 
            href="/family/settings" 
            className="dashboard-nav-link"
            style={{ 
                color: isSettings ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottomColor: isSettings ? 'var(--color-primary)' : 'transparent',
            }}
        >
             設定
        </Link>
      </div>
    </div>
  );
}
