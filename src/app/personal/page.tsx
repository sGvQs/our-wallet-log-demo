import { getCurrentUser, getUserGroup, getGroupExpenses, getPersonalExpenses } from '@/backend/services/data';
import { GroupManager } from '@/components/GroupManager';
import { Card } from '@/components/ui/Card';
import { AddExpenseForm } from '@/components/AddExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { FilterBar } from '@/components/FilterBar';

export default async function PersonalDashboardPage(props: { searchParams: Promise<{ month?: string; category?: string }> }) {
  const searchParams = await props.searchParams;
  const user = await getCurrentUser();
  const group = await getUserGroup();

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>ログインしていません。</h1>
      </div>
    );
  }

  const currentMonth = searchParams.month || new Date().toISOString().slice(0, 7);
  
  const myExpenses = await getPersonalExpenses(currentMonth, searchParams.category) ?? [];
  
  const myTotalAmount = myExpenses?.reduce((sum: number, exp: any) => sum + exp.amount, 0);

  return (
    <div className="dashboard-grid">
      {/* Main Content: Add Expense & My List */}
      <div className="dashboard-main">
         <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem' }}>あたらしく記録する</h2>
            <AddExpenseForm />
         </div>
         
         <div className="dashboard-header">
           <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>自分の支出一覧</h2>
           <FilterBar />
         </div>
         
         {myExpenses?.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--color-border)' }}>
             まだ支出がありません
           </div>
         ) : (
           <ExpenseList expenses={myExpenses} currentUserId={user.id} />
         )}
      </div>

      {/* Sidebar: Summary */}
      <div className="dashboard-sidebar">
          <Card>
              <div style={{ marginBottom: '1.5rem' }}>
                 <h3 style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>自分の支出 ({currentMonth})</h3>
                 <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                     ¥{myTotalAmount.toLocaleString()}
                 </p>
              </div>
              {searchParams.category && searchParams.category !== 'ALL' && (
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                  カテゴリー: {searchParams.category}
                </p>
              )}
          </Card>
      </div>
    </div>
  );
}
