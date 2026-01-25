'use client';

import { Card } from '@/components/ui/Card';
import { PERSONAL_CATEGORIES } from '@/lib/constants/categories';
import { PersonalExpenseCategory } from '@prisma/client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './RecentExpenses.module.css';

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
        <h3 className={styles.title}>最近の支出</h3>
        <div className={styles.emptyState}>
          <p>まだ支出がありません</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className={styles.header}>
        <h3 className={styles.title}>最近の支出</h3>
        <Link href={`/personal/expenses?month=${month}`} className={styles.viewAll}>
          すべて見る
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className={styles.list}>
        {expenses.slice(0, 5).map((expense) => (
          <div key={expense.id} className={styles.item}>
            <div className={styles.itemInfo}>
              <div className={styles.itemHeader}>
                <span className={styles.categoryBadge}>
                  {PERSONAL_CATEGORIES[expense.category]}
                </span>
                {expense.shop && <span className={styles.shop}>{expense.shop}</span>}
              </div>
              {expense.description && (
                <p className={styles.description}>{expense.description}</p>
              )}
            </div>
            <span className={styles.amount}>¥{expense.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
