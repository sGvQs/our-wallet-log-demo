'use client';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: string;
  backgroundColor?: string;
  height?: string;
  showLabel?: boolean;
  labelPosition?: 'inside' | 'outside';
}

export function ProgressBar({
  value,
  max = 100,
  color = 'var(--color-primary-personal)',
  backgroundColor = 'var(--color-border)',
  height = '0.75rem',
  showLabel = false,
  labelPosition = 'outside',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const isOverBudget = value > max;

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          width: '100%',
          height,
          backgroundColor,
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: isOverBudget ? '#e74c3c' : color,
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.3s ease-in-out',
          }}
        />
        {showLabel && labelPosition === 'inside' && (
          <span
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '0.65rem',
              fontWeight: 600,
              color: percentage > 50 ? 'white' : 'var(--color-text-main)',
            }}
          >
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      {showLabel && labelPosition === 'outside' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '0.25rem',
            fontSize: '0.75rem',
            color: isOverBudget ? '#e74c3c' : 'var(--color-text-muted)',
            fontWeight: 500,
          }}
        >
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}
