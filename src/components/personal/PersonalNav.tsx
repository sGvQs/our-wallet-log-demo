'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMonth } from '@/context/MonthContext';
import { Receipt, PiggyBank, House } from 'lucide-react';
import styles from '@/components/common/Nav.module.css';

export function PersonalNav() {
  const pathname = usePathname();
  const { month } = useMonth();

  const isExpenses = pathname.includes('/personal/expenses');
  const isDashboard =  pathname.includes('/personal/dashboard');
  const isBudget = pathname.includes('/personal/budget');

  const getLinkClass = (isActive: boolean) => 
    `dashboard-nav-link ${styles.navLink} ${isActive ? styles.personalActive : styles.inactive}`;

  return (
    <div className="dashboard-nav-container personal-nav">
      <div className="dashboard-nav-content">
        <Link href={`/personal/dashboard?month=${month}`} className={getLinkClass(isDashboard)}>
          <House size={16} className={styles.navIcon} />
          ダッシュボード
        </Link>
        <Link href={`/personal/expenses?month=${month}`} className={getLinkClass(isExpenses)}>
          <Receipt size={16} className={styles.navIcon} />
          支出一覧
        </Link>
        <Link href={`/personal/budget?month=${month}`} className={getLinkClass(isBudget)}>
          <PiggyBank size={16} className={styles.navIcon} />
          予算設定
        </Link>
      </div>
    </div>
  );
}
