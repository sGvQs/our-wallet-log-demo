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
import { PersonalExpenseForm } from './PersonalExpenseForm';

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
        <DrawerContent
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            maxHeight: '90vh',
          }}
        >
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle
              style={{
                color: 'var(--color-text-main)',
                fontSize: '1.15rem',
                fontWeight: 700,
              }}
            >
              支出を記録
            </DrawerTitle>
            <DrawerDescription
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.85rem',
              }}
            >
              個人の支出を入力しましょう
            </DrawerDescription>
          </DrawerHeader>
          <div
            style={{
              padding: '0 1.5rem 1.5rem',
              paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom) + 1rem)',
              overflowY: 'auto',
              maxHeight: 'calc(90vh - 120px)',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <PersonalExpenseForm
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: `
            0 4px 32px rgba(0, 0, 0, 0.12),
            0 0 0 1px rgba(255, 255, 255, 0.5) inset
          `,
          padding: 0,
          overflow: 'hidden',
          maxWidth: '440px',
          width: 'calc(100% - 2rem)',
        }}
      >
        <DialogHeader
          style={{
            padding: '1.25rem 1.5rem 1rem',
            borderBottom: '1px solid var(--color-border)',
            background:
              'linear-gradient(to bottom, var(--color-bg-surface), rgba(248, 250, 253, 0.5))',
          }}
        >
          <DialogTitle
            style={{
              color: 'var(--color-text-main)',
              fontSize: '1.15rem',
              fontWeight: 700,
              marginBottom: '0.25rem',
            }}
          >
            支出を記録
          </DialogTitle>
          <p
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '0.85rem',
              fontWeight: 400,
              margin: 0,
            }}
          >
            個人の支出を入力しましょう
          </p>
        </DialogHeader>
        <div
          style={{
            padding: '1.25rem 1.5rem 1.5rem',
            overflowY: 'auto',
            maxHeight: '70vh',
          }}
        >
          <PersonalExpenseForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
