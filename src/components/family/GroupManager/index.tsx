'use client';

import { useActionState, useState } from 'react';
import { createGroup, joinGroup } from '@/backend/actions/groups';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import styles from './GroupManager.module.css';

export function GroupManager() {
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [createState, createAction, isCreatePending] = useActionState(createGroup, null);
  const [joinState, joinAction, isJoinPending] = useActionState(joinGroup, null);

  return (
    <Card>
      <div className={styles.tabs}>
        <button
          onClick={() => setMode('create')}
          className={`${styles.tab} ${mode === 'create' ? styles.active : styles.inactive}`}
        >
          グループ作成
        </button>
        <button
          onClick={() => setMode('join')}
          className={`${styles.tab} ${mode === 'join' ? styles.active : styles.inactive}`}
        >
          グループに参加
        </button>
      </div>

      {mode === 'create' ? (
        <form action={createAction} className={styles.form}>
          <Input label="グループ名" name="name" placeholder="例: シェアハウス" required />
          {createState?.error && <p className={styles.error}>{createState.error}</p>}
          <Button type="submit" isLoading={isCreatePending}>
            作成する
          </Button>
        </form>
      ) : (
        <form action={joinAction} className={styles.form}>
          <Input label="招待コード" name="inviteCode" placeholder="6桁のコード" required />
          {joinState?.error && <p className={styles.error}>{joinState.error}</p>}
          <Button type="submit" isLoading={isJoinPending}>
            参加する
          </Button>
        </form>
      )}
    </Card>
  );
}
