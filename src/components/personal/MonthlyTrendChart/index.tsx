'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import styles from './MonthlyTrendChart.module.css';

interface MonthlyData {
  month: number;
  budget: number;
  expenses: number;
}

interface MonthlyTrendChartProps {
  monthlyData: MonthlyData[];
  year: number;
}

export function MonthlyTrendChart({ monthlyData, year }: MonthlyTrendChartProps) {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    data: MonthlyData | null;
  }>({ visible: false, x: 0, y: 0, data: null });

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Find max value for scaling
  const maxValue = Math.max(
    ...monthlyData.map(d => Math.max(d.budget, d.expenses)),
    1 // Prevent division by zero
  );

  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  const hasData = monthlyData.some(d => d.budget > 0 || d.expenses > 0);

  if (!hasData) {
    return (
      <Card>
        <h3 className={styles.title}>月別推移</h3>
        <div className={styles.emptyState}>
          <p>{year}年のデータがありません</p>
        </div>
      </Card>
    );
  }

  const handleMouseEnter = (e: React.MouseEvent, data: MonthlyData) => {
    setTooltip({
      visible: true,
      x: e.clientX + 10,
      y: e.clientY - 10,
      data,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltip(prev => ({
      ...prev,
      x: e.clientX + 10,
      y: e.clientY - 10,
    }));
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, data: null });
  };

  return (
    <Card>
      <h3 className={styles.title}>月別推移</h3>
      <div className={styles.chartContainer}>
        <div className={styles.chart}>
          {monthlyData.map((data) => {
            const budgetHeight = (data.budget / maxValue) * 100;
            const expenseHeight = (data.expenses / maxValue) * 100;
            const isCurrentMonth = year === currentYear && data.month === currentMonth;
            const isOverBudget = data.budget > 0 && data.expenses > data.budget;

            return (
              <div
                key={data.month}
                className={styles.monthColumn}
                onMouseEnter={(e) => handleMouseEnter(e, data)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className={styles.barsContainer}>
                  <div
                    className={`${styles.bar} ${styles.barBudget}`}
                    style={{ height: `${budgetHeight}%` }}
                  />
                  <div
                    className={`${styles.bar} ${isOverBudget ? styles.barOver : styles.barExpense}`}
                    style={{ height: `${expenseHeight}%` }}
                  />
                </div>
                <span className={`${styles.monthLabel} ${isCurrentMonth ? styles.currentMonth : ''}`}>
                  {monthNames[data.month - 1]}
                </span>
              </div>
            );
          })}
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendBudget}`} />
            <span>予算</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendExpense}`} />
            <span>支出</span>
          </div>
        </div>
      </div>

      {tooltip.visible && tooltip.data && (
        <div
          className={styles.tooltip}
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className={styles.tooltipTitle}>{monthNames[tooltip.data.month - 1]}</div>
          <div className={styles.tooltipRow}>
            <span>予算:</span>
            <span className={styles.tooltipValue}>¥{tooltip.data.budget.toLocaleString()}</span>
          </div>
          <div className={styles.tooltipRow}>
            <span>支出:</span>
            <span className={styles.tooltipValue}>¥{tooltip.data.expenses.toLocaleString()}</span>
          </div>
        </div>
      )}
    </Card>
  );
}
