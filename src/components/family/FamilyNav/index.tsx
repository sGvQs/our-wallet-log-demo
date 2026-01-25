'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMonth } from '@/context/MonthContext';
import styles from '@/components/common/shared/Nav.module.css';
import { User, UserPlus, Users } from 'lucide-react';

export function FamilyNav() {
  const pathname = usePathname();
  const { month } = useMonth();

  const isExpenses = pathname.includes('/family/expenses');
  const isGroup = pathname.includes('/family/group');
  const isSettings = pathname.includes('/family/settings');

  const getLinkClass = (isActive: boolean) =>
    `dashboard-nav-link ${styles.navLink} ${isActive ? styles.familyActive : styles.inactive}`;

  return (
    <div className="dashboard-nav-container">
      <div className="dashboard-nav-content">
        <Link href={`/family/expenses?month=${month}`} className={getLinkClass(isExpenses)}>
          <User size={16} className={styles.navIcon} />
          自分の出費
        </Link>
        <Link href={`/family/group?month=${month}`} className={getLinkClass(isGroup)}>
          <Users size={16} className={styles.navIcon} />
          チームの出費
        </Link>
        <Link href="/family/settings" className={getLinkClass(isSettings)}>
          <UserPlus size={16} className={styles.navIcon} />
          チームの設定
        </Link>
      </div>
    </div>
  );
}
