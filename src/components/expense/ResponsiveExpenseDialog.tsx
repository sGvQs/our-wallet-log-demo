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
import { ExpenseForm } from './ExpenseForm';
import type { Expense } from '@/types/prisma';

export type ResponsiveExpenseDialogProps = {
  /** Optional trigger element (if not provided, use open/onOpenChange) */
  trigger?: React.ReactNode;
  /** Expense data for edit mode */
  expense?: Expense | null;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Callback when the modal is closed after success */
  onSuccess?: () => void;
};

/**
 * Responsive dialog/drawer component for expense form
 * - Mobile (< 640px): Bottom sheet drawer with swipe-to-close
 * - Desktop (>= 640px): Centered modal dialog
 */
export function ResponsiveExpenseDialog({
  trigger,
  expense,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
}: ResponsiveExpenseDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isMobile = useIsMobile();

  // Support both controlled and uncontrolled modes
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;
  const setIsOpen = isControlled
    ? (open: boolean) => onOpenChange?.(open)
    : setInternalOpen;

  const mode = expense ? 'edit' : 'create';
  const title = mode === 'edit' ? '支出を編集' : '支出を記録';
  const subtitle = mode === 'edit' 
    ? '内容を変更して保存してください' 
    : '今日の支出を入力しましょう';

  const handleSuccess = () => {
    setIsOpen(false);
    onSuccess?.();
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  // Mobile: Drawer (swipe-to-close)
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
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
              {title}
            </DrawerTitle>
            <DrawerDescription
              style={{
                color: 'var(--color-text-muted)',
                fontSize: '0.85rem',
              }}
            >
              {subtitle}
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

  // Desktop: Dialog (centered modal)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
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
            background: 'linear-gradient(to bottom, var(--color-bg-surface), rgba(248, 247, 244, 0.5))',
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
            {title}
          </DialogTitle>
          <p
            style={{
              color: 'var(--color-text-muted)',
              fontSize: '0.85rem',
              fontWeight: 400,
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        </DialogHeader>
        <div
          style={{
            padding: '1.25rem 1.5rem 1.5rem',
            overflowY: 'auto',
            maxHeight: '70vh',
          }}
        >
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
