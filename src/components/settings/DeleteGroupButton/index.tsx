'use client';

import { deleteGroup } from '@/backend/actions/groups';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import styles from '../shared/Button.module.css';

interface DeleteGroupButtonProps {
  groupId: string;
  groupName: string;
}

export function DeleteGroupButton({ groupId, groupName }: DeleteGroupButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmName = prompt(
      `チーム「${groupName}」を削除しますか？\n削除する場合はチーム名を入力してください。`
    );
    if (confirmName !== groupName) {
      return;
    }

    setLoading(true);
    await deleteGroup(groupId);
    setLoading(false);
  };

  return (
    <Button
      variant="ghost"
      onClick={handleDelete}
      isLoading={loading}
      className={styles.deleteButton}
    >
      削除
    </Button>
  );
}
