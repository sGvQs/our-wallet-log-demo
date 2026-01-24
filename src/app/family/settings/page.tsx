import { getGroupSettingsData } from '@/backend/services/data';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createGroup, deleteGroup, joinGroup, leaveGroup } from '@/backend/actions/groups';
import { GroupManager } from '@/components/family'; 
import { DeleteGroupButton } from '@/components/settings/DeleteGroupButton'
import { LeaveGroupButton } from '@/components/settings/LeaveGroupButton';
import { JoinCreatedGroupButton } from '@/components/settings/JoinCreatedGroupButton';
import { CreatedGroupWithGroup, PastGroupWithGroup, Group } from '@/types/prisma';

export default async function SettingsPage() {
  const data = await getGroupSettingsData();
  if (!data) return <div>Auth Error</div>;

  const joinedGroupIds = new Set(data.groups.map((g: Group) => g.id));

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>チーム設定</h1>

      {/* Managed Teams */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
          あなたが作成したチーム
        </h2>
        {data.createdGroups.length === 0 ? (
           <p style={{ color: 'var(--color-text-muted)' }}>作成したチームはありません</p>
        ) : (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {data.createdGroups.map((item: CreatedGroupWithGroup) => {
                 const group = item.group;
                 const isMember = joinedGroupIds.has(group.id);
                 return (
                   <Card key={group.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                       <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{group.name}</div>
                       <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                         招待コード: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{group.inviteCode}</span>
                       </div>
                       {!isMember && (
                           <span style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600 }}>未参加 (閲覧のみ)</span>
                       )}
                     </div>
                     <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {isMember ? (
                            <LeaveGroupButton groupId={group.id} />
                        ) : (
                            <JoinCreatedGroupButton groupId={group.id} />
                        )}
                        <DeleteGroupButton groupId={group.id} groupName={group.name} />
                     </div>
                   </Card>
                 );
             })}
           </div>
        )}
      </section>

      {/* Joined Teams */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
          参加中のチーム
        </h2>
        {data.groups.length === 0 ? (
           <p style={{ color: 'var(--color-text-muted)' }}>参加中のチームはありません</p>
        ) : (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {data.groups.map((group: Group) => {
                 const isCreator = group.creatorId === data.id;
                 
                 return (
                   <Card key={group.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                       <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{group.name}</div>
                       {isCreator && (
                           <span style={{ fontSize: '0.8rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'var(--color-primary)', color: 'white', marginRight: '0.5rem' }}>Owner</span>
                       )}
                     </div>
                     <LeaveGroupButton groupId={group.id} disabled={false} /> 
                     {/* Note: Creator leaving their own group is allowed by schema, but they keep ownership */}
                   </Card>
                 );
             })}
           </div>
        )}
      </section>

      {/* Past Teams 明日やる*/}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
          一度参加したことがあるチーム
        </h2>
        {data.pastGroups.length === 0 ? (
           <p style={{ color: 'var(--color-text-muted)' }}>履歴はありません</p>
        ) : (
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {data.pastGroups.map((item: any) => {
                 const group = item.group;
                 return (
                   <Card key={group.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                       <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{group.name}</div>
                       <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                          招待コード: <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{group.inviteCode}</span>
                       </div>
                     </div>
                     <JoinCreatedGroupButton groupId={group.id} />
                   </Card>
                 );
             })}
           </div>
        )}
      </section>

      {/* Actions */}
      <section>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
            新規作成 / 参加
          </h2>
          <GroupManager />
      </section>
    </div>
  );
}
