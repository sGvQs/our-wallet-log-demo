'use client';

import { PlusCircle } from 'lucide-react';

export type FloatingActionButtonProps = {
  onClick: () => void;
  'aria-label'?: string;
};

/**
 * Sticky bottom button for adding expenses
 * Designed for high visibility and intuitive UX
 */
export function FloatingActionButton({
  onClick,
  'aria-label': ariaLabel = '支出を記録する',
}: FloatingActionButtonProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '1rem',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        background: 'linear-gradient(to top, var(--color-bg-app) 60%, transparent)',
        zIndex: 40, // Lower than modal (z-50) so modal appears on top
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
          onClick={onClick}
          aria-label={ariaLabel}
          style={{
            width: '100%',
            minHeight: '48px', // Ensure 44px+ tap target for accessibility
            padding: '0.875rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            boxShadow: `
              0 4px 14px rgba(217, 119, 87, 0.35),
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
            WebkitTapHighlightColor: 'transparent', // Remove tap highlight on mobile
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `
              0 6px 20px rgba(217, 119, 87, 0.4),
              0 3px 6px rgba(0, 0, 0, 0.12),
              inset 0 1px 0 rgba(255, 255, 255, 0.15)
            `;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = `
              0 4px 14px rgba(217, 119, 87, 0.35),
              0 2px 4px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.15)
            `;
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
        >
          <PlusCircle size={20} strokeWidth={2} />
          <span>支出を記録する</span>
        </button>
      </div>
    </div>
  );
}
