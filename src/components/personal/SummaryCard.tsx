'use client';

import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface SummaryCardProps {
  totalBudget: number;
  totalExpenses: number;
  budgetUsedPercent: number;
  month: string;
}

export function SummaryCard({
  totalBudget,
  totalExpenses,
  budgetUsedPercent,
  month,
}: SummaryCardProps) {
  const remaining = totalBudget - totalExpenses;
  const isOverBudget = remaining < 0;
  const hasBudget = totalBudget > 0;

  const formatMonth = (m: string) => {
    const [year, month] = m.split('-');
    return `${year}年${parseInt(month)}月`;
  };

  return (
    <Card>
      <div style={{ marginBottom: '1rem' }}>
        <h3
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            marginBottom: '0.5rem',
            fontWeight: 500,
          }}
        >
          {formatMonth(month)} の予算状況
        </h3>
        
        {hasBudget ? (
          <>
            {/* Progress bar */}
            <div style={{ marginBottom: '1rem' }}>
              <ProgressBar
                value={totalExpenses}
                max={totalBudget}
                showLabel={true}
                labelPosition="outside"
                height="1rem"
              />
            </div>

            {/* Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '0.25rem',
                  }}
                >
                  予算
                </p>
                <p
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-main)',
                  }}
                >
                  ¥{totalBudget.toLocaleString()}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginBottom: '0.25rem',
                  }}
                >
                  支出
                </p>
                <p
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--color-text-main)',
                  }}
                >
                  ¥{totalExpenses.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Remaining */}
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: isOverBudget
                  ? 'rgba(231, 76, 60, 0.1)'
                  : 'rgba(94, 138, 204, 0.1)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {isOverBudget ? (
                <AlertTriangle size={18} color="#e74c3c" />
              ) : remaining < totalBudget * 0.2 ? (
                <TrendingDown size={18} color="#f39c12" />
              ) : (
                <TrendingUp size={18} color="var(--color-primary-personal)" />
              )}
              <div>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {isOverBudget ? '予算超過' : '残り予算'}
                </p>
                <p
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: isOverBudget ? '#e74c3c' : 'var(--color-primary-personal)',
                  }}
                >
                  {isOverBudget ? '-' : ''}¥{Math.abs(remaining).toLocaleString()}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: 'var(--color-text-muted)',
            }}
          >
            <p style={{ marginBottom: '0.5rem' }}>予算が設定されていません</p>
            <p style={{ fontSize: '0.85rem' }}>
              「予算設定」から今月の予算を設定しましょう
            </p>
            
            {/* Show total expenses even without budget */}
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>今月の支出</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                ¥{totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
