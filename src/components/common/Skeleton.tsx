import { Card } from '@/components/ui/Card';

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton ${className || ''}`} style={style} />;
}

export function ExpenseListSkeleton() {
  return (
    <div className="expense-list">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="expense-card" style={{ padding: '1rem' }}>
          <div className="expense-content">
            <div className="expense-info">
              <Skeleton className="skeleton-badge" />
              <Skeleton className="skeleton-text" style={{ width: '60%' }} />
            </div>
            <div className="expense-actions">
              <Skeleton className="skeleton-amount" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="dashboard-sidebar">
      <Card style={{ height: '120px' }}>
        <Skeleton className="skeleton-text" style={{ width: '40%', marginBottom: '1rem' }} />
        <Skeleton className="skeleton-text" style={{ height: '2.5rem', width: '70%' }} />
      </Card>
      <Card style={{ height: '300px' }}>
        <Skeleton className="skeleton-text" style={{ width: '50%', marginBottom: '1.5rem' }} />
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton className="skeleton-badge" style={{ width: '30%' }} />
            <Skeleton className="skeleton-badge" style={{ width: '40%' }} />
          </div>
        ))}
      </Card>
    </div>
  );
}
