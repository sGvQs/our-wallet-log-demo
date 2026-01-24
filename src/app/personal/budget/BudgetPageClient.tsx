'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { BudgetMatrix } from '@/components/personal/BudgetMatrix';
import { PersonalExpenseCategory } from '@prisma/client';

interface ExistingBudget {
  id: number;
  targetMonth: number;
  targetYear: number;
  category: PersonalExpenseCategory;
  amount: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface BudgetPageClientProps {
  year: number;
  initialBudgets: ExistingBudget[];
}

export function BudgetPageClient({ year, initialBudgets }: BudgetPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleYearChange = (newYear: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', newYear.toString());
    router.push(`/personal/budget?${params.toString()}`);
  };

  return (
    <BudgetMatrix
      year={year}
      initialBudgets={initialBudgets}
      onYearChange={handleYearChange}
    />
  );
}
