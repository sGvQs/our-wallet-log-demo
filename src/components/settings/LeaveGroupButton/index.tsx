'use client';

import { leaveGroup } from '@/backend/actions/groups';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import styles from '../shared/Button.module.css';

interface LeaveGroupButtonProps {
  groupId: string;
  disabled?: boolean;
}

export function LeaveGroupButton({ groupId, disabled }: LeaveGroupButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLeave = async () => {
    setLoading(true);
    await leaveGroup(groupId);
    setLoading(false);
  };

  return (
    <Button
      variant="secondary"
      onClick={handleLeave}
      isLoading={loading}
      disabled={disabled}
      className={styles.leaveButton}
    >
      脱退
    </Button>
  );
}
