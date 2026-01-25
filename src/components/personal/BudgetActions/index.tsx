'use client';

import { useState } from 'react';
import { BudgetDialog } from '../BudgetDialog';
import { PlusCircle } from 'lucide-react';
import styles from '../shared/Dialog.module.css';

export function BudgetActions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className={styles.fabContainer}>
        <div className={styles.fabWrapper}>
          <button
            onClick={() => setIsDialogOpen(true)}
            aria-label="予算を追加する"
            className={styles.fabButton}
          >
            <PlusCircle size={20} strokeWidth={2} />
            <span>予算を追加する</span>
          </button>
        </div>
      </div>

      <BudgetDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => setIsDialogOpen(false)}
      />
    </>
  );
}
