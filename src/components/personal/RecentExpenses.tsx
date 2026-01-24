'use client';

import { Card } from '@/components/ui/Card';
import { PERSONAL_CATEGORIES } from '@/lib/constants/categories';
import { PersonalExpenseCategory } from '@prisma/client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface PersonalExpense {
  id: string;
  amount: number;
  description: string | null;
  shop: string | null;
  date: Date;
  category: PersonalExpenseCategory;
}

interface RecentExpensesProps {
  expenses: PersonalExpense[];
  month: string;
}

export function RecentExpenses({ expenses, month }: RecentExpensesProps) {
  if (expenses.length === 0) {
    return (
      <Card>
        <h3
          style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-muted)',
            marginBottom: '1rem',
            fontWeight: 600,
          }}
        >
          最近の支出
        </h3>
        <div
          style={{
            textAlign: 'center',
            padding: '2rem 1rem',
            color: 'var(--color-text-muted)',
          }}
        >
          <p>まだ支出がありません</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <h3
          style={{
            fontSize: '0.9rem',
            color: 'var(--color-text-muted)',
            fontWeight: 600,
          }}
        >
          最近の支出
        </h3>
        <Link
          href={`/personal/expenses?month=${month}`}
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-primary-personal)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            textDecoration: 'none',
          }}
        >
          すべて見る
          <ArrowRight size={14} />
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {expenses.slice(0, 5).map((expense) => (
          <div
            key={expense.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0',
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.125rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.125rem 0.375rem',
                    background: 'var(--color-bg-app)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {PERSONAL_CATEGORIES[expense.category]}
                </span>
                {expense.shop && (
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-text-main)',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {expense.shop}
                  </span>
                )}
              </div>
              {expense.description && (
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {expense.description}
                </p>
              )}
            </div>
            <span
              style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: 'var(--color-text-main)',
                marginLeft: '0.5rem',
              }}
            >
              ¥{expense.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
