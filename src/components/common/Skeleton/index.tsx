import { Card } from '@/components/ui/Card';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div 
      className={`${styles.skeleton} ${className || ''}`}
      style={style}
    />
  );
}

export function ExpenseListSkeleton() {
  return (
    <div className={styles.expenseList}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className={styles.expenseCard}>
          <div className={styles.expenseContent}>
            <div className={styles.expenseInfo}>
              <Skeleton className={styles.badge} />
              <Skeleton style={{ width: '60%' }} />
            </div>
            <div className={styles.expenseActions}>
              <Skeleton className={styles.amount} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className={styles.sidebar}>
      <Card className={styles.summaryCard}>
        <Skeleton className={styles.marginBottom} style={{ width: '40%' }} />
        <Skeleton style={{ height: '2.5rem', width: '70%' }} />
      </Card>
      <Card className={styles.breakdownCard}>
        <Skeleton className={styles.marginBottomLg} style={{ width: '50%' }} />
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.breakdownRow}>
            <Skeleton style={{ width: '30%' }} />
            <Skeleton style={{ width: '40%' }} />
          </div>
        ))}
      </Card>
    </div>
  );
}
