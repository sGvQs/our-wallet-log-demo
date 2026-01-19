'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface MonthContextType {
  month: string;
  setMonth: (month: string) => void;
}

const MonthContext = createContext<MonthContextType | undefined>(undefined);

export function MonthProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Default to current month if not specified
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  const [month, setMonthState] = useState(searchParams.get('month') || defaultMonth);

  // Sync state with URL parameter if it changes externally (e.g. back button)
  useEffect(() => {
    const monthParam = searchParams.get('month');
    if (monthParam && monthParam !== month) {
      setMonthState(monthParam);
    }
  }, [searchParams, month]);

  const setMonth = (newMonth: string) => {
    setMonthState(newMonth);
    const params = new URLSearchParams(searchParams);
    params.set('month', newMonth);
    router.push(`${pathname}?${params.toString()}`);
  };

  const value = useMemo(() => ({ month, setMonth }), [month, pathname, searchParams, router]);

  return (
    <MonthContext.Provider value={value}>
      {children}
    </MonthContext.Provider>
  );
}

export function useMonth() {
  const context = useContext(MonthContext);
  if (context === undefined) {
    throw new Error('useMonth must be used within a MonthProvider');
  }
  return context;
}
