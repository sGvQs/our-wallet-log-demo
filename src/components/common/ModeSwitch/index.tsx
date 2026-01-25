'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMonth } from '@/context/MonthContext';
import { Users, User } from 'lucide-react';
import styles from './ModeSwitch.module.css';

export function ModeSwitch() {
  const pathname = usePathname();
  const { month } = useMonth();
  
  const isPersonalMode = pathname.startsWith('/personal');
  const isFamilyMode = pathname.startsWith('/family');

  const familyLinkClass = [
    styles.link,
    isFamilyMode && styles.active,
    isFamilyMode && styles.familyActive,
  ].filter(Boolean).join(' ');

  const personalLinkClass = [
    styles.link,
    isPersonalMode && styles.active,
    isPersonalMode && styles.personalActive,
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.container}>
      <Link href={`/family/expenses?month=${month}`} className={familyLinkClass}>
        <Users size={16} />
        <span>家族</span>
      </Link>
      <Link href={`/personal/dashboard?month=${month}`} className={personalLinkClass}>
        <User size={16} />
        <span>個人</span>
      </Link>
    </div>
  );
}
