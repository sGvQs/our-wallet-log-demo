'use client';

import { useState, useTransition } from 'react';
import { updateSplitRatio } from '@/backend/actions/groups';
import styles from './SplitRatioSlider.module.css';

interface SplitRatioSliderProps {
    groupId: string;
    initialRatio: number;
    creatorName: string;
    partnerName: string;
}

export function SplitRatioSlider({
    groupId,
    initialRatio,
    creatorName,
    partnerName,
}: SplitRatioSliderProps) {
    const [ratio, setRatio] = useState(initialRatio);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const partnerRatio = 100 - ratio;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRatio(parseInt(e.target.value, 10));
        setMessage(null);
    };

    const handleSave = () => {
        startTransition(async () => {
            const result = await updateSplitRatio(groupId, ratio);
            if (result.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setMessage({ type: 'success', text: '保存しました' });
                setTimeout(() => setMessage(null), 3000);
            }
        });
    };

    const handleReset = () => {
        setRatio(50);
        setMessage(null);
    };

    const hasChanged = ratio !== initialRatio;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>⚖️ 負担割合の設定</h3>

            <div className={styles.ratioDisplay}>
                <div className={styles.ratioCard}>
                    <span className={styles.ratioLabel}>{creatorName}</span>
                    <span className={styles.ratioValue}>{ratio}%</span>
                </div>
                <div className={styles.separator}>:</div>
                <div className={styles.ratioCard}>
                    <span className={styles.ratioLabel}>{partnerName}</span>
                    <span className={styles.ratioValue}>{partnerRatio}%</span>
                </div>
            </div>

            <div className={styles.sliderWrapper}>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={ratio}
                    onChange={handleChange}
                    className={styles.slider}
                    disabled={isPending}
                />
                <div className={styles.sliderLabels}>
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                </div>
            </div>

            <p className={styles.hint}>
                💡 収入差などに応じて、それぞれの負担割合を調整できます
            </p>

            <div className={styles.actions}>
                <button
                    type="button"
                    onClick={handleReset}
                    className={styles.resetButton}
                    disabled={isPending || ratio === 50}
                >
                    リセット (50:50)
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    className={styles.saveButton}
                    disabled={isPending || !hasChanged}
                >
                    {isPending ? '保存中...' : '保存'}
                </button>
            </div>

            {message && (
                <div className={`${styles.message} ${message.type === 'error' ? styles.messageError : styles.messageSuccess}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
}
