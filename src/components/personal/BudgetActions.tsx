'use client';

import { useState } from 'react';
import { BudgetDialog } from './BudgetDialog';
import { PlusCircle } from 'lucide-react';

export function BudgetActions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem',
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
          background: 'linear-gradient(to top, var(--color-bg-app) 60%, transparent)',
          zIndex: 40,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            pointerEvents: 'auto',
          }}
        >
          <button
            onClick={() => setIsDialogOpen(true)}
            aria-label="予算を追加する"
            style={{
              width: '100%',
              minHeight: '48px',
              padding: '0.875rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-primary-personal)',
              color: '#fff',
              border: 'none',
              boxShadow: `
                0 4px 14px rgba(94, 138, 204, 0.35),
                0 2px 4px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.15)
              `,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: 600,
              letterSpacing: '0.01em',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              fontFamily: 'inherit',
              WebkitTapHighlightColor: 'transparent',
            }}
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
