'use client';

import { useState, useMemo, useTransition } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PERSONAL_CATEGORIES } from '@/lib/constants/personal-categories';
import { savePersonalBudgets } from '@/backend/actions/personal-budget';
import { PersonalExpenseCategory } from '@prisma/client';
import { Save, Loader2 } from 'lucide-react';

// Categories to show in budget (excluding ALL)
const BUDGET_CATEGORIES: PersonalExpenseCategory[] = [
  'FOOD',
  'HOUSING',
  'UTILITIES',
  'DAILY',
  'TRAVEL',
  'ENTERTAINMENT',
  'HOBBY',
  'CLOTHING',
  'BEAUTY',
  'MEDICAL',
  'EDUCATION',
  'GIFTS',
  'SUBSCRIPTION',
  'SAVINGS',
  'OTHER',
];

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

interface BudgetData {
  [key: string]: number; // key: `${month}-${category}`
}

interface ExistingBudget {
  id: number;
  targetMonth: number;
  category: PersonalExpenseCategory;
  amount: number;
}

interface BudgetMatrixProps {
  year: number;
  initialBudgets: ExistingBudget[];
  onYearChange: (year: number) => void;
}

export function BudgetMatrix({
  year,
  initialBudgets,
  onYearChange,
}: BudgetMatrixProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initialize budget data from existing budgets
  const initialData: BudgetData = {};
  for (const budget of initialBudgets) {
    const key = `${budget.targetMonth}-${budget.category}`;
    initialData[key] = budget.amount;
  }

  const [budgets, setBudgets] = useState<BudgetData>(initialData);

  // Calculate totals
  const monthlyTotals = useMemo(() => {
    const totals: Record<number, number> = {};
    for (const month of MONTHS) {
      totals[month] = 0;
      for (const category of BUDGET_CATEGORIES) {
        const key = `${month}-${category}`;
        totals[month] += budgets[key] || 0;
      }
    }
    return totals;
  }, [budgets]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const category of BUDGET_CATEGORIES) {
      totals[category] = 0;
      for (const month of MONTHS) {
        const key = `${month}-${category}`;
        totals[category] += budgets[key] || 0;
      }
    }
    return totals;
  }, [budgets]);

  const yearTotal = useMemo(() => {
    return Object.values(monthlyTotals).reduce((sum, v) => sum + v, 0);
  }, [monthlyTotals]);

  const handleChange = (month: number, category: PersonalExpenseCategory, value: string) => {
    const key = `${month}-${category}`;
    const numValue = parseInt(value) || 0;
    setBudgets((prev) => ({
      ...prev,
      [key]: numValue,
    }));
    setSuccess(false);
  };

  const handleSave = () => {
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      // Convert budgets to array format
      const budgetArray: Array<{ month: number; category: PersonalExpenseCategory; amount: number }> = [];

      for (const month of MONTHS) {
        for (const category of BUDGET_CATEGORIES) {
          const key = `${month}-${category}`;
          const amount = budgets[key] || 0;
          if (amount > 0) {
            budgetArray.push({ month, category, amount });
          }
        }
      }

      const result = await savePersonalBudgets(year, budgetArray);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  };

  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  return (
    <div>
      {/* Year selector */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => onYearChange(y)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: y === year ? 'var(--color-primary-personal)' : 'transparent',
                color: y === year ? 'white' : 'var(--color-text-main)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
              }}
            >
              {y}年
            </button>
          ))}
        </div>

        <Button
          onClick={handleSave}
          disabled={isPending}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--color-primary-personal)',
          }}
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          保存する
        </Button>
      </div>

      {/* Status messages */}
      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            background: 'rgba(231, 76, 60, 0.1)',
            border: '1px solid rgba(231, 76, 60, 0.3)',
            borderRadius: 'var(--radius-sm)',
            color: '#c0392b',
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            background: 'rgba(39, 174, 96, 0.1)',
            border: '1px solid rgba(39, 174, 96, 0.3)',
            borderRadius: 'var(--radius-sm)',
            color: '#27ae60',
          }}
        >
          保存しました
        </div>
      )}

      {/* Year total display */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '1rem', fontWeight: 600 }}>
            {year}年の予算合計
          </span>
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--color-primary-personal)',
            }}
          >
            ¥{yearTotal.toLocaleString()}
          </span>
        </div>
      </Card>

      {/* Budget matrix table */}
      <Card style={{ overflow: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.85rem',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  position: 'sticky',
                  left: 0,
                  background: 'var(--color-bg-surface)',
                  padding: '0.75rem 0.5rem',
                  textAlign: 'left',
                  borderBottom: '2px solid var(--color-border)',
                  minWidth: '100px',
                  zIndex: 1,
                }}
              >
                カテゴリ
              </th>
              {MONTHS.map((month) => (
                <th
                  key={month}
                  style={{
                    padding: '0.75rem 0.25rem',
                    textAlign: 'center',
                    borderBottom: '2px solid var(--color-border)',
                    minWidth: '80px',
                    fontWeight: 600,
                  }}
                >
                  {month}月
                </th>
              ))}
              <th
                style={{
                  padding: '0.75rem 0.5rem',
                  textAlign: 'right',
                  borderBottom: '2px solid var(--color-border)',
                  minWidth: '100px',
                  fontWeight: 700,
                  background: 'var(--color-bg-app)',
                }}
              >
                年間合計
              </th>
            </tr>
          </thead>
          <tbody>
            {BUDGET_CATEGORIES.map((category) => (
              <tr key={category}>
                <td
                  style={{
                    position: 'sticky',
                    left: 0,
                    background: 'var(--color-bg-surface)',
                    padding: '0.5rem',
                    borderBottom: '1px solid var(--color-border)',
                    fontWeight: 500,
                    zIndex: 1,
                  }}
                >
                  {PERSONAL_CATEGORIES[category]}
                </td>
                {MONTHS.map((month) => {
                  const key = `${month}-${category}`;
                  return (
                    <td
                      key={month}
                      style={{
                        padding: '0.25rem',
                        borderBottom: '1px solid var(--color-border)',
                      }}
                    >
                      <input
                        type="number"
                        value={budgets[key] || ''}
                        onChange={(e) => handleChange(month, category, e.target.value)}
                        placeholder="0"
                        style={{
                          width: '100%',
                          padding: '0.375rem',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-sm)',
                          textAlign: 'right',
                          fontSize: '0.8rem',
                          background: 'var(--color-bg-app)',
                        }}
                      />
                    </td>
                  );
                })}
                <td
                  style={{
                    padding: '0.5rem',
                    borderBottom: '1px solid var(--color-border)',
                    textAlign: 'right',
                    fontWeight: 600,
                    background: 'var(--color-bg-app)',
                  }}
                >
                  ¥{categoryTotals[category].toLocaleString()}
                </td>
              </tr>
            ))}
            {/* Monthly totals row */}
            <tr style={{ background: 'var(--color-bg-app)' }}>
              <td
                style={{
                  position: 'sticky',
                  left: 0,
                  background: 'var(--color-bg-app)',
                  padding: '0.75rem 0.5rem',
                  fontWeight: 700,
                  borderTop: '2px solid var(--color-border)',
                  zIndex: 1,
                }}
              >
                月合計
              </td>
              {MONTHS.map((month) => (
                <td
                  key={month}
                  style={{
                    padding: '0.75rem 0.25rem',
                    textAlign: 'center',
                    fontWeight: 600,
                    borderTop: '2px solid var(--color-border)',
                  }}
                >
                  ¥{monthlyTotals[month].toLocaleString()}
                </td>
              ))}
              <td
                style={{
                  padding: '0.75rem 0.5rem',
                  textAlign: 'right',
                  fontWeight: 700,
                  borderTop: '2px solid var(--color-border)',
                  color: 'var(--color-primary-personal)',
                }}
              >
                ¥{yearTotal.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
