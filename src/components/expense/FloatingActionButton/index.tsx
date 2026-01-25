'use client';

import { PlusCircle } from 'lucide-react';
import styles from './FloatingActionButton.module.css';

export type FloatingActionButtonProps = {
  onClick: () => void;
  'aria-label'?: string;
};

export function FloatingActionButton({
  onClick,
  'aria-label': ariaLabel = '支出を記録する',
}: FloatingActionButtonProps) {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <button onClick={onClick} aria-label={ariaLabel} className={styles.button}>
          <PlusCircle size={20} strokeWidth={2} />
          <span>支出を記録する</span>
        </button>
      </div>
    </div>
  );
}
