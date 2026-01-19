'use server';

import { prisma } from '@/backend/db';
import { getAuthenticatedUser } from '@/backend/auth/utils';
import { revalidatePath } from 'next/cache';

// Helper to generate a random 6-character code
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function createGroup(prevState: any, formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: 'Not authenticated' };

  // Check if user is already in a group
  const userWithGroups = await prisma.user.findUnique({
      where: { id: user.id },
      include: { groups: true }
  });

  if (userWithGroups?.groups.length && userWithGroups.groups.length > 0) {
      return { error: 'すでに他のチームに参加しています。新しいチームを作成するには、現在のチームを脱退してください。' };
  }

  const name = formData.get('name') as string;
  if (!name) return { error: 'グループ名を入力してください' };

  try {
    const code = generateInviteCode();
    
    // Create group, set creator
    const group = await prisma.group.create({
        data: {
            name,
            inviteCode: code,
            creatorId: user.id,
            users: {
                connect: { id: user.id }
            }
        }
    });

    // Add to CreatedGroup table
    await prisma.createdGroup.create({
        data: {
            userId: user.id,
            groupId: group.id
        }
    });
    
  } catch (e) {
    return { error: "登録に失敗しました" };
  }

  revalidatePath('/group');
  return { success: true };
}

export async function joinGroup(prevState: any, formData: FormData) {
  const user = await getAuthenticatedUser();
  if (!user) return { error: 'Not authenticated' };

  const inviteCode = formData.get('inviteCode') as string;
  if (!inviteCode) return { error: '招待コードを入力してください' };

  // Check if user is already in a group
  const userWithGroups = await prisma.user.findUnique({
      where: { id: user.id },
      include: { groups: true }
  });

  if (userWithGroups?.groups.length && userWithGroups.groups.length > 0) {
      return { error: 'すでに他のチームに参加しています。別のチームに参加するには、現在のチームを脱退してください。' };
  }

  const group = await prisma.group.findUnique({
    where: { inviteCode }
  });

  if (!group) {
    return { error: '無効な招待コードです' };
  }

  // Connect user to group and remove from past members if applicable
  await prisma.$transaction([
      prisma.group.update({
          where: { id: group.id },
          data: {
              users: {
                  connect: { id: user.id }
              }
          }
      }),
      // Remove from PastGroup if exists (clean up history logic)
      prisma.pastGroup.deleteMany({
          where: {
              userId: user.id,
              groupId: group.id
          }
      })
  ]);

  revalidatePath('/group');
  return { success: true };
}

export async function leaveGroup(groupId: string) {
    const user = await getAuthenticatedUser();
    if (!user) return { error: 'Not authenticated' };

    await prisma.$transaction([
        prisma.group.update({
            where: { id: groupId },
            data: {
                users: {
                    disconnect: { id: user.id }
                }
            }
        }),
        prisma.pastGroup.create({
            data: {
                userId: user.id,
                groupId: groupId
            }
        })
    ]);

    revalidatePath('/group');
    return { success: true };
}

export async function deleteGroup(groupId: string) {
    const user = await getAuthenticatedUser();
    if (!user) return { error: 'Not authenticated' };

    const group = await prisma.group.findUnique({
        where: { id: groupId }
    });

    if (!group) return { error: 'Not found' };

    if (group.creatorId !== user.id) {
        return { error: '権限がありません' };
    }

    // Delete group (cascade should handle relations if configured, but Implicit might need care? 
    // Actually Implicit handles table cleanup. Expense cleanup? 
    // Expenses are not linked to Group anymore, so we don't need to delete them? 
    // Wait, if Group is deleted, expenses of members are still there linked to Users. 
    // Ideally we should delete expenses if they were "group expenses", but currently Expense is loosely coupled.
    // For now, just delete the group record.
    // Delete group dependencies manually since we don't have Cascade set up in schema yet
    await prisma.createdGroup.deleteMany({ where: { groupId } });
    await prisma.pastGroup.deleteMany({ where: { groupId } });
    await prisma.group.delete({ where: { id: groupId } });

    revalidatePath('/group');
    return { success: true };
}

export async function joinCreatedGroup(groupId: string) {
    const user = await getAuthenticatedUser();
    if (!user) return { error: 'Not authenticated' };

    // Check if user is already in a group
    const userWithGroups = await prisma.user.findUnique({
        where: { id: user.id },
        include: { groups: true }
    });

    if (userWithGroups?.groups.length && userWithGroups.groups.length > 0) {
        return { error: 'すでに他のチームに参加しています。新しいチームに参加するには、現在のチームを脱退してください。' };
    }

    await prisma.$transaction([
        prisma.group.update({
            where: { id: groupId },
            data: {
                users: {
                    connect: { id: user.id }
                }
            }
        }),
        prisma.pastGroup.deleteMany({
            where: { userId: user.id, groupId }
        })
    ]);

    revalidatePath('/group');
    revalidatePath('/personal');
    revalidatePath('/settings');
    return { success: true };
}
