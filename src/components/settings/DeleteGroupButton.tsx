'use client';

import { useActionState } from 'react'; // React 19 / Next.js

import { deleteGroup } from '@/backend/actions/groups';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function DeleteGroupButton({ groupId, groupName }: { groupId: string, groupName: string }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        const confirmName = prompt(`チーム「${groupName}」を削除しますか？\n削除する場合はチーム名を入力してください。`);
        if (confirmName !== groupName) {
            if (confirmName !== null) alert('チーム名が一致しません');
            return;
        }
        
        setLoading(true);
        const res = await deleteGroup(groupId);
        setLoading(false);
        if(res.error) alert(res.error);
    };

    return (
        <Button variant="ghost" onClick={handleDelete} isLoading={loading} style={{ color: 'var(--text-muted)' }}>
            削除
        </Button>
    );
}
