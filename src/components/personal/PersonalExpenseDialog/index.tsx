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
import { PersonalExpenseForm, PersonalExpense } from '../PersonalExpenseForm';
import styles from '../shared/Dialog.module.css';

interface PersonalExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  expense?: PersonalExpense;
}

export function PersonalExpenseDialog({
  open,
  onOpenChange,
  onSuccess,
  expense,
}: PersonalExpenseDialogProps) {
  const isMobile = useIsMobile();
  const isEditing = !!expense;
  const title = isEditing ? '支出を編集' : '支出を記録';
  const description = isEditing ? '支出内容を変更しましょう' : '個人の支出を入力しましょう';

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
            <DrawerTitle className={styles.drawerTitle}>{title}</DrawerTitle>
            <DrawerDescription className={styles.drawerDescription}>
              {description}
            </DrawerDescription>
          </DrawerHeader>
          <div className={styles.drawerBody}>
            <PersonalExpenseForm expense={expense} onSuccess={handleSuccess} onCancel={handleCancel} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className={styles.dialogContent}>
        <DialogHeader className={styles.dialogHeader}>
          <DialogTitle className={styles.dialogTitle}>{title}</DialogTitle>
          <p className={styles.dialogSubtitle}>{description}</p>
        </DialogHeader>
        <div className={styles.dialogBody}>
          <PersonalExpenseForm expense={expense} onSuccess={handleSuccess} onCancel={handleCancel} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
