'use client';

import { useEffect } from 'react';
import { PERSONAL_CATEGORIES, PERSONAL_CATEGORY_COLORS } from '@/lib/constants/categories';
import type { YearlyCategoryBudgetComparison } from '@/backend/services/personal-data';
import styles from './CategoryDrilldownModal.module.css';

interface CategoryDrilldownModalProps {
    category: YearlyCategoryBudgetComparison;
    year: number;
    onClose: () => void;
}

const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export function CategoryDrilldownModal({ category, year, onClose }: CategoryDrilldownModalProps) {
    const categoryLabel = PERSONAL_CATEGORIES[category.category];
    const color = PERSONAL_CATEGORY_COLORS[category.category] || '#888';

    // Find max value for chart scaling
    const maxValue = Math.max(
        ...category.monthlyBreakdown.map(d => Math.max(d.budgetAmount, d.expenseAmount)),
        1
    );

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <span className={styles.colorDot} style={{ backgroundColor: color }} />
                        <h2 className={styles.title}>{categoryLabel}</h2>
                        <span className={styles.yearBadge}>{year}年 月別推移</span>
                    </div>
                    <button className={styles.closeButton} onClick={onClose} aria-label="閉じる">
                        ✕
                    </button>
                </div>

                {/* Summary Cards */}
                <div className={styles.summaryGrid}>
                    <div className={styles.summaryCard}>
                        <span className={styles.summaryLabel}>年間予算</span>
                        <span className={styles.summaryValue}>
                            ¥{category.yearlyBudgetAmount.toLocaleString()}
                        </span>
                    </div>
                    <div className={styles.summaryCard}>
                        <span className={styles.summaryLabel}>年間支出</span>
                        <span className={styles.summaryValue}>
                            ¥{category.yearlyExpenseAmount.toLocaleString()}
                        </span>
                    </div>
                    <div className={`${styles.summaryCard} ${category.difference >= 0 ? styles.summaryPositive : styles.summaryNegative}`}>
                        <span className={styles.summaryLabel}>
                            {category.difference >= 0 ? '残り予算' : '超過額'}
                        </span>
                        <span className={styles.summaryValue}>
                            ¥{Math.abs(category.difference).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Monthly Chart */}
                <div className={styles.chartSection}>
                    <h3 className={styles.sectionTitle}>月別グラフ</h3>
                    <div className={styles.chart}>
                        {category.monthlyBreakdown.map((data) => {
                            const budgetHeight = (data.budgetAmount / maxValue) * 100;
                            const expenseHeight = (data.expenseAmount / maxValue) * 100;
                            const isOverBudget = data.budgetAmount > 0 && data.expenseAmount > data.budgetAmount;

                            return (
                                <div key={data.month} className={styles.monthColumn}>
                                    <div className={styles.barsContainer}>
                                        {data.budgetAmount > 0 && (
                                            <div
                                                className={`${styles.bar} ${styles.barBudget}`}
                                                style={{ height: `${budgetHeight}%` }}
                                            />
                                        )}
                                        {data.expenseAmount > 0 && (
                                            <div
                                                className={`${styles.bar} ${isOverBudget ? styles.barOver : styles.barExpense}`}
                                                style={{ height: `${expenseHeight}%`, backgroundColor: color }}
                                            />
                                        )}
                                    </div>
                                    <span className={styles.monthLabel}>{monthNames[data.month - 1]}</span>
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
                            <span className={styles.legendDot} style={{ backgroundColor: color }} />
                            <span>支出</span>
                        </div>
                    </div>
                </div>

                {/* Monthly Table */}
                <div className={styles.tableSection}>
                    <h3 className={styles.sectionTitle}>月別詳細</h3>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>月</th>
                                    <th>予算</th>
                                    <th>支出</th>
                                    <th>差額</th>
                                    {/* <th>達成率</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {category.monthlyBreakdown.map((data) => {
                                    const difference = data.budgetAmount - data.expenseAmount;
                                    const percent = data.budgetAmount > 0
                                        ? Math.round((data.expenseAmount / data.budgetAmount) * 100)
                                        : null;
                                    const isOver = data.budgetAmount > 0 && data.expenseAmount > data.budgetAmount;

                                    // Skip months with no data
                                    if (data.budgetAmount === 0 && data.expenseAmount === 0) {
                                        return (
                                            <tr key={data.month} className={styles.emptyRow}>
                                                <td>{monthNames[data.month - 1]}</td>
                                                <td colSpan={4} className={styles.noData}>データなし</td>
                                            </tr>
                                        );
                                    }

                                    return (
                                        <tr key={data.month}>
                                            <td>{monthNames[data.month - 1]}</td>
                                            <td>
                                                {data.budgetAmount > 0
                                                    ? `¥${data.budgetAmount.toLocaleString()}`
                                                    : '-'
                                                }
                                            </td>
                                            <td>¥{data.expenseAmount.toLocaleString()}</td>
                                            <td className={difference >= 0 ? styles.positive : styles.negative}>
                                                {data.budgetAmount > 0
                                                    ? `${difference >= 0 ? '+' : ''}¥${difference.toLocaleString()}`
                                                    : '-'
                                                }
                                            </td>
                                            {/* <td className={isOver ? styles.negative : ''}>
                                                {percent !== null ? `${percent}%` : '-'}
                                            </td> */}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
