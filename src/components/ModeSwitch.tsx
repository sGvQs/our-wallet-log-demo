'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMonth } from '@/context/MonthContext';
import { Users, User } from 'lucide-react';

export function ModeSwitch() {
  const pathname = usePathname();
  const { month } = useMonth();
  
  const isPersonalMode = pathname.startsWith('/personal');
  const isFamilyMode = pathname.startsWith('/family');

  return (
    <div 
      style={{
        display: 'flex',
        gap: '0.25rem',
        padding: '0.25rem',
        background: 'var(--color-bg-app)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
      }}
    >
      <Link
        href={`/family/expenses?month=${month}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          fontWeight: 500,
          transition: 'all var(--transition-base)',
          background: isFamilyMode ? 'var(--color-primary)' : 'transparent',
          color: isFamilyMode ? 'white' : 'var(--color-text-muted)',
          textDecoration: 'none',
          border: 'none',
        }}
      >
        <Users size={16} />
        <span>家族</span>
      </Link>
      <Link
        href={`/personal/dashboard?month=${month}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          fontWeight: 500,
          transition: 'all var(--transition-base)',
          background: isPersonalMode ? 'var(--color-primary-personal)' : 'transparent',
          color: isPersonalMode ? 'white' : 'var(--color-text-muted)',
          textDecoration: 'none',
          border: 'none',
        }}
      >
        <User size={16} />
        <span>個人</span>
      </Link>
    </div>
  );
}
