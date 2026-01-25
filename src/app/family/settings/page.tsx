import { getGroupSettingsData } from '@/backend/services/data';
import { Card } from '@/components/ui/Card';
import { GroupManager } from '@/components/family';
import { DeleteGroupButton, LeaveGroupButton, JoinCreatedGroupButton } from '@/components/settings';
import { CreatedGroupWithGroup, Group } from '@/types/prisma';
import styles from './page.module.css';

export default async function SettingsPage() {
  const data = await getGroupSettingsData();
  if (!data) return <div>Auth Error</div>;

  const joinedGroupIds = new Set(data.groups.map((g: Group) => g.id));

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>チーム設定</h1>

      {/* Managed Teams */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>あなたが作成したチーム</h2>
        {data.createdGroups.length === 0 ? (
          <p className={styles.emptyMessage}>作成したチームはありません</p>
        ) : (
          <div className={styles.cardList}>
            {data.createdGroups.map((item: CreatedGroupWithGroup) => {
              const group = item.group;
              const isMember = joinedGroupIds.has(group.id);
              return (
                <Card key={group.id} className={styles.cardRow}>
                  <div>
                    <div className={styles.groupName}>{group.name}</div>
                    <div className={styles.inviteCode}>
                      招待コード: <span className={styles.codeValue}>{group.inviteCode}</span>
                    </div>
                    {!isMember && <span className={styles.notJoinedBadge}>未参加 (閲覧のみ)</span>}
                  </div>
                  <div className={styles.buttonGroup}>
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
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>参加中のチーム</h2>
        {data.groups.length === 0 ? (
          <p className={styles.emptyMessage}>参加中のチームはありません</p>
        ) : (
          <div className={styles.cardList}>
            {data.groups.map((group: Group) => {
              const isCreator = group.creatorId === data.id;
              return (
                <Card key={group.id} className={styles.cardRow}>
                  <div>
                    <div className={styles.groupName}>{group.name}</div>
                    {isCreator && <span className={styles.ownerBadge}>Owner</span>}
                  </div>
                  <LeaveGroupButton groupId={group.id} disabled={false} />
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
