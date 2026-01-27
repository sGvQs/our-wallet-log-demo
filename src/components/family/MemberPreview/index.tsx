'use client';

import styles from './MemberPreview.module.css';

interface Member {
    id: number;
    name: string | null;
    email: string;
}

interface MemberPreviewProps {
    members: Member[];
    currentUserId: number;
    maxMembers?: number;
}

export function MemberPreview({ members, currentUserId, maxMembers = 2 }: MemberPreviewProps) {
    const isFull = members.length >= maxMembers;

    // 自分を先頭にソート
    const sortedMembers = [...members].sort((a, b) => {
        if (a.id === currentUserId) return -1;
        if (b.id === currentUserId) return 1;
        return 0;
    });

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>
                👥 チームメンバー
                <span className={styles.count}>({members.length}/{maxMembers}人)</span>
            </h3>

            <div className={styles.memberGrid}>
                {sortedMembers.map((member) => {
                    const isMe = member.id === currentUserId;
                    const initial = (member.name || member.email)?.[0]?.toUpperCase() || '?';

                    return (
                        <div key={member.id} className={styles.memberCard}>
                            <div className={`${styles.avatar} ${isMe ? styles.avatarMe : styles.avatarPartner}`}>
                                {initial}
                            </div>
                            <div className={styles.memberInfo}>
                                <span className={styles.memberName}>
                                    {member.name || member.email.split('@')[0]}
                                </span>
                                {isMe && (
                                    <span className={styles.youBadge}>あなた</span>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* 招待待ちスロット */}
                {!isFull && (
                    <div className={`${styles.memberCard} ${styles.emptySlot}`}>
                        <div className={styles.avatarEmpty}>
                            <span className={styles.plusIcon}>+</span>
                        </div>
                        <div className={styles.memberInfo}>
                            <span className={styles.inviteText}>パートナーを招待</span>
                            <span className={styles.inviteHint}>招待コードを共有してください</span>
                        </div>
                    </div>
                )}
            </div>

            {isFull && (
                <p className={styles.fullMessage}>
                    ✓ チームメンバーが揃いました
                </p>
            )}
        </div>
    );
}
