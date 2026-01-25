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
import { PersonalExpenseForm } from '../PersonalExpenseForm';
import styles from '../shared/Dialog.module.css';

interface PersonalExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PersonalExpenseDialog({
  open,
  onOpenChange,
  onSuccess,
}: PersonalExpenseDialogProps) {
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
            <DrawerTitle className={styles.drawerTitle}>支出を記録</DrawerTitle>
            <DrawerDescription className={styles.drawerDescription}>
              個人の支出を入力しましょう
            </DrawerDescription>
          </DrawerHeader>
          <div className={styles.drawerBody}>
            <PersonalExpenseForm onSuccess={handleSuccess} onCancel={handleCancel} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className={styles.dialogContent}>
        <DialogHeader className={styles.dialogHeader}>
          <DialogTitle className={styles.dialogTitle}>支出を記録</DialogTitle>
          <p className={styles.dialogSubtitle}>個人の支出を入力しましょう</p>
        </DialogHeader>
        <div className={styles.dialogBody}>
          <PersonalExpenseForm onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
