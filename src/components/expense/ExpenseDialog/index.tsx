'use client';

import { useState } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerDescription,
} from '@/components/ui/drawer';
import { ExpenseForm } from '../ExpenseForm';
import type { Expense } from '@/types/prisma';
import styles from './ExpenseDialog.module.css';

export type ResponsiveExpenseDialogProps = {
  trigger?: React.ReactNode;
  expense?: Expense | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
};

export function ResponsiveExpenseDialog({
  trigger,
  expense,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
}: ResponsiveExpenseDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isMobile = useIsMobile();

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled
    ? (open: boolean) => onOpenChange?.(open)
    : setInternalOpen;

  const mode = expense ? 'edit' : 'create';
  const title = mode === 'edit' ? '支出を編集' : '支出を記録';
  const subtitle =
    mode === 'edit' ? '内容を変更して保存してください' : '今日の支出を入力しましょう';

  const handleSuccess = () => {
    setIsOpen(false);
    onSuccess?.();
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
        <DrawerContent className={styles.drawerContent}>
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle className={styles.drawerTitle}>{title}</DrawerTitle>
            <DrawerDescription className={styles.drawerDescription}>
              {subtitle}
            </DrawerDescription>
          </DrawerHeader>
          <div className={styles.drawerBody}>
            <ExpenseForm
              mode={mode}
              initialData={expense}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent showCloseButton={false} className={styles.dialogContent}>
        <DialogHeader className={styles.dialogHeader}>
          <DialogTitle className={styles.dialogTitle}>{title}</DialogTitle>
          <p className={styles.dialogSubtitle}>{subtitle}</p>
        </DialogHeader>
        <div className={styles.dialogBody}>
          <ExpenseForm
            mode={mode}
            initialData={expense}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
