'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMonth } from '@/context/MonthContext';

export function DashboardNav() {
  const pathname = usePathname();
  const { month } = useMonth();

  const isPersonal = pathname.includes('/personal');
  const isGroup = pathname.includes('/group');
  const isSettings = pathname.includes('/settings');



  return (
    <div className="dashboard-nav-container">
      <div className="dashboard-nav-content">
        <Link 
            href={`/personal?month=${month}`} 
            className="dashboard-nav-link"
            style={{ 
                color: isPersonal ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottomColor: isPersonal ? 'var(--color-primary)' : 'transparent',
            }}
        >
            自分の家計簿
        </Link>
        <Link 
            href={`/group?month=${month}`} 
            className="dashboard-nav-link"
            style={{ 
                color: isGroup ? 'var(--color-primary)' : 'var(--color-text-muted)',
                borderBottomColor: isGroup ? 'var(--color-primary)' : 'transparent',
            }}
        >
             チームの出費
        </Link>
        <Link 
            href="/settings" 
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
