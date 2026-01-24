'use client';

import { useState } from 'react';
import { FloatingActionButton } from '@/components/expense/FloatingActionButton';
import { PersonalExpenseDialog } from './PersonalExpenseDialog';

export function PersonalExpenseActions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <FloatingActionButton onClick={() => setIsDialogOpen(true)} />
      <PersonalExpenseDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => setIsDialogOpen(false)}
      />
    </>
  );
}
