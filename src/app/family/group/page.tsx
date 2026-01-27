import { Suspense } from 'react';
import { getCurrentUser, getUserGroup, getGroupExpenses } from '@/backend/services/data';
import { calculateSettlements } from '@/backend/services/settlement';
import { Card } from '@/components/ui/Card';
import { ExpenseList } from '@/components/family';
import { FilterBar, ExpenseListSkeleton, SidebarSkeleton } from '@/components/common';
import { ExpenseActions } from '@/components/expense';
import { FAMILY_CATEGORIES } from '@/lib/constants/categories';
import styles from './page.module.css';

export default async function GroupDashboardPage(props: { searchParams: Promise<{ month?: string; category?: string }> }) {
  const searchParams = await props.searchParams;
  const currentMonth = searchParams.month || new Date().toISOString().slice(0, 7);

  return (
    <div className="dashboard-grid">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <FilterBar category={FAMILY_CATEGORIES} />
        </div>

        <Suspense fallback={<ExpenseListSkeleton />}>
          <GroupExpensesSection currentMonth={currentMonth} category={searchParams.category} />
        </Suspense>
      </div>

      <Suspense fallback={<SidebarSkeleton />}>
        <GroupSidebarSection currentMonth={currentMonth} category={searchParams.category} />
      </Suspense>

      <ExpenseActions />
    </div>
  );
}

async function GroupExpensesSection({ currentMonth, category }: { currentMonth: string, category?: string }) {
  const user = await getCurrentUser();
  const group = await getUserGroup();

  if (!group || !user) return <GroupAuthError user={user} />;

  const expenses = await getGroupExpenses(currentMonth, category);

  if (expenses.length === 0) {
    return <div className={styles.emptyState}>まだ支出がありません</div>;
  }

  return <ExpenseList expenses={expenses} currentUserId={user.id} />;
}

async function GroupSidebarSection({ currentMonth, category }: { currentMonth: string, category?: string }) {
  const user = await getCurrentUser();
  const group = await getUserGroup();

  if (!group || !user) return null;

  const expenses = await getGroupExpenses(currentMonth, category);
  const totalAmount = expenses.reduce((sum: number, exp: { amount: number }) => sum + exp.amount, 0);

  const members: { userId: number; user: { name: string | null } }[] = group.users.map((u: { id: number; name: string | null }) => ({
    userId: u.id,
    user: { name: u.name }
  }));

  // Use custom split ratio from group settings
  const splitRatio = (group as any).splitRatio ?? 50;
  const creatorId = group.creatorId;

  const { balances, settlements } = calculateSettlements(expenses, members, creatorId, splitRatio);

  const getName = (id: number) => members.find(m => m.userId === id)?.user.name || 'Unknown';
  const creatorName = getName(creatorId);
  const partnerRatio = 100 - splitRatio;

  return (
    <div className="dashboard-sidebar">
      {/* Split Ratio Display (if not 50:50) */}
      {splitRatio !== 50 && (
        <Card className={styles.ratioCard}>
          <h3 className={styles.ratioTitle}>⚖️ 負担割合</h3>
          <div className={styles.ratioDisplay}>
            <span>{creatorName}: {splitRatio}%</span>
            <span className={styles.ratioSeparator}>:</span>
            <span>{partnerRatio}%</span>
          </div>
        </Card>
      )}

      <Card className={styles.settlementCard}>
        <h3 className={styles.settlementTitle}>
          <span>💰</span> 精算プラン ({currentMonth.replace('-', '年')}月)
        </h3>
        {settlements.length > 0 ? (
          <div className={styles.settlementList}>
            {settlements.map((s, i) => (
              <div key={i} className={styles.settlementItem}>
                <div className={styles.settlementNames}>
                  <span className={styles.settlementName}>{getName(s.fromUserId)}</span>
                  <span className={styles.settlementArrow}>→</span>
                  <span className={styles.settlementName}>{getName(s.toUserId)}</span>
                </div>
                <div className={styles.settlementAmount}>¥{s.amount.toLocaleString()}</div>
              </div>
            ))}
            <p className={styles.settlementHint}>
              {splitRatio === 50 ? 'これを支払えば平均になります' : `これを支払えば${splitRatio}:${partnerRatio}割になります`}
            </p>
          </div>
        ) : (
          <p className={styles.noSettlement}>精算は不要です 🎉</p>
        )}
      </Card>

      <Card>
        <div>
          <h3 className={styles.totalTitle}>チーム合計 ({currentMonth})</h3>
          <p className={styles.totalAmount}>¥{totalAmount.toLocaleString()}</p>
        </div>
      </Card>

      <Card>
        <h3 className={styles.balanceTitle}>バランス詳細</h3>
        <div className={styles.balanceList}>
          {balances.map((b) => (
            <div key={b.userId} className={styles.balanceItem}>
              <div className={styles.balanceUser}>
                <div className={styles.avatar}>{b.name[0]}</div>
                <span className={styles.userName}>{b.name}</span>
              </div>
              <div className={styles.balanceDetails}>
                <div className={styles.paidAmount}>払った額: ¥{b.paid.toLocaleString()}</div>
                <div className={styles.targetAmount}>負担額: ¥{b.targetAmount.toLocaleString()}</div>
                <div className={`${styles.balance} ${b.balance >= 0 ? styles.balancePositive : styles.balanceNegative}`}>
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
    <div className={styles.authError}>
      <h1 className={styles.authErrorTitle}>ようこそ、{user?.name || 'ゲスト'}さん</h1>
      <p className={styles.authErrorMessage}>
        設定からグループを作成するか、既存のグループに参加しましょう。
      </p>
    </div>
  );
}
