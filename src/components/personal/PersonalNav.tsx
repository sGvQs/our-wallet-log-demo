'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMonth } from '@/context/MonthContext';
import { LayoutDashboard, Receipt, PiggyBank } from 'lucide-react';

export function PersonalNav() {
  const pathname = usePathname();
  const { month } = useMonth();

  const isDashboard = pathname.includes('/personal/dashboard');
  const isExpenses = pathname.includes('/personal/expenses');
  const isBudget = pathname.includes('/personal/budget');

  const linkStyle = (isActive: boolean) => ({
    color: isActive ? 'var(--color-primary-personal)' : 'var(--color-text-muted)',
    borderBottomColor: isActive ? 'var(--color-primary-personal)' : 'transparent',
  });

  return (
    <div className="dashboard-nav-container personal-nav">
      <div className="dashboard-nav-content">
        {/* <Link 
            href={`/personal/dashboard?month=${month}`} 
            className="dashboard-nav-link"
            style={linkStyle(isDashboard)}
        >
            <LayoutDashboard size={16} style={{ marginRight: '0.25rem' }} />
            ダッシュボード
        </Link> */}
        <Link 
            href={`/personal/expenses?month=${month}`} 
            className="dashboard-nav-link"
            style={linkStyle(isExpenses)}
        >
            <Receipt size={16} style={{ marginRight: '0.25rem' }} />
            支出一覧
        </Link>
        <Link 
            href={`/personal/budget?month=${month}`} 
            className="dashboard-nav-link"
            style={linkStyle(isBudget)}
        >
            <PiggyBank size={16} style={{ marginRight: '0.25rem' }} />
            予算設定
        </Link>
      </div>
    </div>
  );
}
