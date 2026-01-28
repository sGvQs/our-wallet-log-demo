'use client';

import { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { joinCreatedGroup } from '@/backend/actions/groups';

interface JoinCreatedGroupButtonProps {
  groupId: string;
}

export function JoinCreatedGroupButton({ groupId }: JoinCreatedGroupButtonProps) {
  const [state, action, isPending] = useActionState(async () => {
    const result = await joinCreatedGroup(groupId);
    if (result.error) {
      return { error: result.error };
    }
    return { success: true };
  }, null);

  return (
    <form action={action}>
      <Button variant="secondary" disabled={isPending} isLoading={isPending}>
        参加する
      </Button>
    </form>
  );
}
