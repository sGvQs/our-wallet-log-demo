'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { PERSONAL_CATEGORIES, PERSONAL_CATEGORY_COLORS } from '@/lib/constants/categories';
import type { YearlyCategoryBudgetComparison } from '@/backend/services/personal-data';
import { CategoryDrilldownModal } from '../CategoryDrilldownModal';
import styles from './YearlyCategoryBudgetCard.module.css';

interface YearlyCategoryBudgetCardProps {
    comparisons: YearlyCategoryBudgetComparison[];
    year: number;
}

export function YearlyCategoryBudgetCard({ comparisons, year }: YearlyCategoryBudgetCardProps) {
    const [selectedCategory, setSelectedCategory] = useState<YearlyCategoryBudgetComparison | null>(null);

    if (comparisons.length === 0) {
        return (
            <Card>
                <h3 className={styles.title}>カテゴリー別 年間予算達成状況</h3>
                <div className={styles.emptyState}>
                    <p>予算または支出がありません</p>
                </div>
            </Card>
        );
    }

    return (
        <>
            <Card>
                <div className={styles.header}>
                    <h3 className={styles.title}>カテゴリー別 年間予算達成状況</h3>
                    <span className={styles.yearBadge}>{year}年</span>
                </div>
                <div className={styles.list}>
                    {comparisons.map((item) => {
                        const color = PERSONAL_CATEGORY_COLORS[item.category] || '#888';
                        const categoryLabel = PERSONAL_CATEGORIES[item.category];

                        // Determine status
                        const isWarning = item.usedPercent !== null && item.usedPercent >= 80 && item.usedPercent < 100;
                        const isOver = item.isOverBudget;
                        const isGood = item.hasBudget && !isOver && !isWarning;

                        // Bar width (cap at 100% for visual)
                        const barWidth = item.usedPercent !== null
                            ? Math.min(item.usedPercent, 100)
                            : 0;

                        return (
                            <div
                                key={item.category}
                                className={styles.item}
                                onClick={() => setSelectedCategory(item)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setSelectedCategory(item);
                                    }
                                }}
                            >
                                <div className={styles.itemHeader}>
                                    <div className={styles.labelGroup}>
                                        <span className={styles.colorDot} style={{ backgroundColor: color }} />
                                        <span className={styles.categoryName}>{categoryLabel}</span>
                                        {isOver && (
                                            <span className={`${styles.statusBadge} ${styles.statusOverBudget}`}>
                                                予算超過
                                            </span>
                                        )}
                                        {isWarning && (
                                            <span className={`${styles.statusBadge} ${styles.statusWarning}`}>
                                                注意
                                            </span>
                                        )}
                                        {isGood && (
                                            <span className={`${styles.statusBadge} ${styles.statusGood}`}>
                                                良好
                                            </span>
                                        )}
                                        {!item.hasBudget && (
                                            <span className={`${styles.statusBadge} ${styles.statusNoBudget}`}>
                                                予算未設定
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.rightSection}>
                                        {item.usedPercent !== null && (
                                            <span className={`${styles.percentText} ${isOver ? styles.percentOver : isWarning ? styles.percentWarning : styles.percentNormal
                                                }`}>
                                                {item.usedPercent}%
                                            </span>
                                        )}
                                        <span className={styles.drilldownIcon}>▶</span>
                                    </div>
                                </div>

                                {item.hasBudget && (
                                    <div className={styles.barContainer}>
                                        <div
                                            className={`${styles.barFill} ${isOver ? styles.barOver : isWarning ? styles.barWarning : styles.barNormal
                                                }`}
                                            style={{ width: `${barWidth}%` }}
                                        />
                                    </div>
                                )}

                                <div className={styles.detailRow}>
                                    <span className={styles.expenseAmount}>
                                        ¥{item.yearlyExpenseAmount.toLocaleString()}
                                        {item.hasBudget && (
                                            <span className={styles.budgetAmount}>
                                                {' '}/ ¥{item.yearlyBudgetAmount.toLocaleString()}
                                            </span>
                                        )}
                                    </span>
                                    {item.hasBudget && (
                                        <span className={item.difference >= 0 ? styles.remainingPositive : styles.remainingNegative}>
                                            {item.difference >= 0
                                                ? `残り: ¥${item.difference.toLocaleString()}`
                                                : `超過: ¥${Math.abs(item.difference).toLocaleString()}`
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {selectedCategory && (
                <CategoryDrilldownModal
                    category={selectedCategory}
                    year={year}
                    onClose={() => setSelectedCategory(null)}
                />
            )}
        </>
    );
}
