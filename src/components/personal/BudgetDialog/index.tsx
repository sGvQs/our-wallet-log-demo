'use client';

import { useIsMobile } from '@/hooks/useMediaQuery';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { BudgetForm } from '../BudgetForm';
import styles from '../shared/Dialog.module.css';

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BudgetDialog({ open, onOpenChange, onSuccess }: BudgetDialogProps) {
  const isMobile = useIsMobile();

  const handleSuccess = () => {
    onOpenChange(false);
    onSuccess?.();
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className={styles.drawerContent}>
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle className={styles.drawerTitle}>予算を追加</DrawerTitle>
            <DrawerDescription className={styles.drawerDescription}>
              カテゴリごとの月間予算を設定しましょう
            </DrawerDescription>
          </DrawerHeader>
          <div className={styles.drawerBody}>
            <BudgetForm onSuccess={handleSuccess} onCancel={handleCancel} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className={styles.dialogContent}>
        <DialogHeader className={styles.dialogHeader}>
          <DialogTitle className={styles.dialogTitle}>予算を追加</DialogTitle>
          <p className={styles.dialogSubtitle}>
            カテゴリごとの月間予算を設定しましょう
          </p>
        </DialogHeader>
        <div className={styles.dialogBody}>
          <BudgetForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
