'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HelpCircle } from 'lucide-react';
import styles from './FloatingGuideLink.module.css';

export function FloatingGuideLink() {
    const pathname = usePathname();

    if (pathname === '/guide') {
        return null;
    }

    if (pathname === '/personal/expenses') {
        return null;
    }

    if (pathname === '/personal/budget') {
        return null;
    }

    if (pathname === '/family/group') {
        return null;
    }

    if (pathname === '/family/expenses') {
        return null;
    }

    return (
        <Link href="/guide" className={styles.floatingButton} aria-label="使い方を見る">
            <HelpCircle size={20} />
            <span className={styles.label}>使い方</span>
        </Link>
    );
}
