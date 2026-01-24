'use client';

import { Card } from '@/components/ui/Card';
import { PERSONAL_CATEGORIES, CATEGORY_COLORS } from '@/lib/constants/personal-categories';
import { PersonalExpenseCategory } from '@prisma/client';

interface CategorySummary {
  category: PersonalExpenseCategory;
  total: number;
  count: number;
}

interface CategoryBreakdownProps {
  categorySummary: CategorySummary[];
  totalExpenses: number;
}

export function CategoryBreakdown({
  categorySummary,
  totalExpenses,
}: CategoryBreakdownProps) {
  if (categorySummary.length === 0) {
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
          カテゴリ別内訳
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
      <h3
        style={{
          fontSize: '0.9rem',
          color: 'var(--color-text-muted)',
          marginBottom: '1rem',
          fontWeight: 600,
        }}
      >
        カテゴリ別内訳
      </h3>

      {/* Simple bar chart */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {categorySummary.map((item) => {
          const percentage = totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0;
          const color = CATEGORY_COLORS[item.category] || '#888';

          return (
            <div key={item.category}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      width: '0.75rem',
                      height: '0.75rem',
                      borderRadius: '2px',
                      backgroundColor: color,
                    }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {PERSONAL_CATEGORIES[item.category]}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    ({item.count}件)
                  </span>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  ¥{item.total.toLocaleString()}
                </span>
              </div>
              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  height: '0.5rem',
                  backgroundColor: 'var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: color,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
