'use client';

import { useActionState } from 'react'; // React 19 / Next.js
// If not available use useFormState
import { leaveGroup } from '@/backend/actions/groups';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';

export function LeaveGroupButton({ groupId, disabled }: { groupId: string, disabled?: boolean }) {
    const [loading, setLoading] = useState(false);

    const handleLeave = async () => {
        if(!confirm('本当にこのチームから抜けますか？')) return;
        setLoading(true);
        await leaveGroup(groupId);
        setLoading(false);
    };

    return (
        <Button variant="secondary" onClick={handleLeave} isLoading={loading} disabled={disabled} style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)' }}>
            脱退
        </Button>
    );
}
