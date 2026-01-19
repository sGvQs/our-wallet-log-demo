'use client';

import { useActionState, useState } from 'react';
import { createGroup, joinGroup } from '@/backend/actions/groups';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export function GroupManager() {
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [createState, createAction, isCreatePending] = useActionState(createGroup, null);
  const [joinState, joinAction, isJoinPending] = useActionState(joinGroup, null);

  return (
    <Card className="max-w-md mx-auto">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
        <button 
          onClick={() => setMode('create')}
          style={{ 
            fontWeight: mode === 'create' ? 700 : 400,
            borderBottom: mode === 'create' ? '2px solid var(--color-primary)' : 'none',
            paddingBottom: '0.25rem',
            color: mode === 'create' ? 'var(--color-primary)' : 'var(--color-text-muted)'
          }}
        >
          グループ作成
        </button>
        <button 
          onClick={() => setMode('join')}
          style={{ 
            fontWeight: mode === 'join' ? 700 : 400,
            borderBottom: mode === 'join' ? '2px solid var(--color-primary)' : 'none',
            paddingBottom: '0.25rem',
            color: mode === 'join' ? 'var(--color-primary)' : 'var(--color-text-muted)'
          }}
        >
          グループに参加
        </button>
      </div>

      {mode === 'create' ? (
        <form action={createAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input 
            label="グループ名" 
            name="name" 
            placeholder="例: シェアハウス" 
            required
          />
          {createState?.error && <p style={{ color: 'var(--color-accent)' }}>{createState.error}</p>}
          <Button type="submit" isLoading={isCreatePending}>作成する</Button>
        </form>
      ) : (
        <form action={joinAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input 
            label="招待コード" 
            name="inviteCode" 
            placeholder="6桁のコード" 
            required
          />
          {joinState?.error && <p style={{ color: 'var(--color-accent)' }}>{joinState.error}</p>}
          <Button type="submit" isLoading={isJoinPending}>参加する</Button>
        </form>
      )}
    </Card>
  );
}
