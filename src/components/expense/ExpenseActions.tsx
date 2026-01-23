'use client';

import { useState } from 'react';
import { FloatingActionButton } from './FloatingActionButton';
import { ResponsiveExpenseDialog } from './ResponsiveExpenseDialog';

/**
 * Client component that provides FAB + Responsive Dialog/Drawer for creating expenses
 * Used in server component pages
 */
export function ExpenseActions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <FloatingActionButton onClick={() => setIsDialogOpen(true)} />
      <ResponsiveExpenseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => setIsDialogOpen(false)}
      />
    </>
  );
}
