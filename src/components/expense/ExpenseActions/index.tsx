'use client';

import { useState } from 'react';
import { FloatingActionButton } from '../FloatingActionButton';
import { ResponsiveExpenseDialog } from '../ExpenseDialog';

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
