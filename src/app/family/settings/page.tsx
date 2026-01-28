import { getGroupSettingsData } from '@/backend/services/data';
import { Card } from '@/components/ui/Card';
import { GroupManager, MemberPreview, SplitRatioSlider } from '@/components/family';
import { DeleteGroupButton, LeaveGroupButton, JoinCreatedGroupButton } from '@/components/settings';
import { CreatedGroupWithGroup } from '@/types/prisma';
import styles from './page.module.css';

// Extended types for the new data structure
interface GroupWithMembers {
  id: string;
  name: string;
  inviteCode: string;
  creatorId: number;
  splitRatio?: number;  // Optional for backwards compatibility
  users: { id: number; name: string | null; email: string }[];
}

export default async function SettingsPage() {
  const data = await getGroupSettingsData();
  if (!data) return <div>Auth Error</div>;

  const joinedGroupIds = new Set(data.groups.map((g: GroupWithMembers) => g.id));

  return (
    <div className={styles.container}>
      {/* Joined Teams - Now with Member Preview and Split Ratio */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>参加中のチーム</h2>
        {data.groups.length === 0 ? (
          <p className={styles.emptyMessage}>参加中のチームはありません</p>
        ) : (
          <div className={styles.cardList}>
            {data.groups.map((group: GroupWithMembers) => {
              const isCreator = group.creatorId === data.id;
              const creator = group.users.find(u => u.id === group.creatorId);
              const partner = group.users.find(u => u.id !== group.creatorId);

              return (
                <Card key={group.id}>
                  <div className={styles.cardHeader}>
                    <div className={styles.groupName}>{group.name}</div>
                    {isCreator && <span className={styles.ownerBadge}>Owner</span>}
                  </div>

                  {/* Member Preview */}
                  <MemberPreview
                    members={group.users}
                    currentUserId={data.id}
                    maxMembers={2}
                  />

                  {/* Split Ratio Slider - Only show if 2 members */}
                  {group.users.length === 2 && (
                    <SplitRatioSlider
                      groupId={group.id}
                      initialRatio={group.splitRatio ?? 50}
                      creatorName={creator?.name || creator?.email?.split('@')[0] || 'オーナー'}
                      partnerName={partner?.name || partner?.email?.split('@')[0] || 'パートナー'}
                    />
                  )}

                  <div className={styles.cardFooter}>
                    <div className={styles.inviteCode}>
                      招待コード: <span className={styles.codeValue}>{group.inviteCode}</span>
                    </div>
                    <LeaveGroupButton groupId={group.id} disabled={false} />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Managed Teams */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>あなたが作成したチーム</h2>
        {data.createdGroups.length === 0 ? (
          <p className={styles.emptyMessage}>作成したチームはありません</p>
        ) : (
          <div className={styles.cardList}>
            {data.createdGroups.map((item: CreatedGroupWithGroup) => {
              const group = item.group as unknown as GroupWithMembers;
              const isMember = joinedGroupIds.has(group.id);
              const isFull = group.users?.length >= 2;

              return (
                <Card key={group.id} className={styles.cardRow}>
                  <div>
                    <div className={styles.groupName}>{group.name}</div>
                    <div className={styles.inviteCode}>
                      招待コード: <span className={styles.codeValue}>{group.inviteCode}</span>
                    </div>
                    {!isMember && <span className={styles.notJoinedBadge}>未参加 (閲覧のみ)</span>}
                    {isFull && <span className={styles.fullBadge}>満員 (2/2)</span>}
                  </div>
                  <div className={styles.buttonGroup}>
                    {isMember ? (
                      <LeaveGroupButton groupId={group.id} />
                    ) : isFull ? (
                      <button className={styles.disabledButton} disabled>満員</button>
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

      {/* Past Teams */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>一度参加したことがあるチーム</h2>
        {data.pastGroups.length === 0 ? (
          <p className={styles.emptyMessage}>履歴はありません</p>
        ) : (
          <div className={styles.cardList}>
            {data.pastGroups.map((item: any) => {
              const group = item.group;
              return (
                <Card key={group.id} className={styles.cardRow}>
                  <div>
                    <div className={styles.groupName}>{group.name}</div>
                    <div className={styles.inviteCode}>
                      招待コード: <span className={styles.codeValue}>{group.inviteCode}</span>
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
        <h2 className={styles.sectionTitle}>新規作成 / 参加</h2>
        <GroupManager />
      </section>
    </div>
  );
}
