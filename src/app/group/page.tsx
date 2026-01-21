import { Suspense } from 'react';
import { getCurrentUser, getUserGroup, getGroupExpenses } from '@/backend/services/data';
import { calculateSettlements } from '@/backend/services/settlement';
import { Card } from '@/components/ui/Card';
import { ExpenseList } from '@/components/ExpenseList';
import { FilterBar } from '@/components/FilterBar';
import { ExpenseListSkeleton, Skeleton, SidebarSkeleton } from '@/components/Skeleton';

export default async function GroupDashboardPage(props: { searchParams: Promise<{ month?: string; category?: string }> }) {
  const searchParams = await props.searchParams;
  const currentMonth = searchParams.month || new Date().toISOString().slice(0, 7);

  return (
    <div className="dashboard-grid">
      {/* Main Content: Team Expense List */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            チームの支出一覧
          </h2>
          <FilterBar />
        </div>

        <Suspense fallback={<ExpenseListSkeleton />}>
          <GroupExpensesSection currentMonth={currentMonth} category={searchParams.category} />
        </Suspense>
      </div>

      {/* Sidebar: Summary & Settlements */}
      <Suspense fallback={<SidebarSkeleton />}>
        <GroupSidebarSection currentMonth={currentMonth} category={searchParams.category} />
      </Suspense>
    </div>
  );
}

async function GroupExpensesSection({ currentMonth, category }: { currentMonth: string, category?: string }) {
  const user = await getCurrentUser();
  const group = await getUserGroup();

  if (!group || !user) return <GroupAuthError user={user} />;

  const expenses = await getGroupExpenses(currentMonth, category);

  if (expenses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
        まだ支出がありません
      </div>
    );
  }

  return <ExpenseList expenses={expenses} currentUserId={user.id} />;
}

async function GroupSidebarSection({ currentMonth, category }: { currentMonth: string, category?: string }) {
  const user = await getCurrentUser();
  const group = await getUserGroup();

  if (!group || !user) return null;

  const expenses = await getGroupExpenses(currentMonth, category);
  const totalAmount = expenses.reduce((sum: number, exp: { amount: number }) => sum + exp.amount, 0);

  const members: { userId: number; user: { name: string } }[] = group.users.map((u: { id: number; name: string | null }) => ({
    userId: u.id,
    user: { name: u.name || 'Unknown' }
  }));
  const { balances, settlements } = calculateSettlements(expenses, members);

  const getName = (id: number) => members.find(m => m.userId === id)?.user.name || 'Unknown';

  return (
    <div className="dashboard-sidebar">
      {/* Settlement Plan */}
      <Card style={{ border: '2px solid var(--color-border)', background: 'var(--color-bg-surface)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>💰</span> 精算プラン ({currentMonth.replace('-', '年')}月)
        </h3>
        {settlements.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {settlements.map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--color-bg-app)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                  <span style={{ fontWeight: 600 }}>{getName(s.fromUserId)}</span>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>→</span>
                  <span style={{ fontWeight: 600 }}>{getName(s.toUserId)}</span>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                  ¥{s.amount.toLocaleString()}
                </div>
              </div>
            ))}
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
              これを支払えば平均になります
            </p>
          </div>
        ) : (
          <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>
            精算は不要です 🎉
          </p>
        )}
      </Card>

      <Card>
        <div>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>チーム合計 ({currentMonth})</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            ¥{totalAmount.toLocaleString()}
          </p>
        </div>
      </Card>

      <Card>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>バランス詳細</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {balances.map((b) => (
            <div key={b.userId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--color-bg-app)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontWeight: 700, fontSize: '0.8rem'
                }}>
                  {b.name[0]}
                </div>
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{b.name}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>払った額: ¥{b.paid.toLocaleString()}</div>
                <div style={{
                  fontSize: '0.9rem', fontWeight: 700,
                  color: b.balance >= 0 ? 'var(--accent-blue)' : 'var(--accent-red)'
                }}>
                  {b.balance >= 0 ? '+' : ''}{b.balance.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function GroupAuthError({ user }: { user: any }) {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>ようこそ、{user?.name || 'ゲスト'}さん</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        設定からグループを作成するか、既存のグループに参加しましょう。
      </p>
    </div>
  );
}
