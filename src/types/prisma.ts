/**
 * Type definitions for Prisma data used in Next.js pages
 * These types match the data returned by backend services
 */
import { Prisma } from '@prisma/client';

// ============================================
// Base model types from Prisma
// ============================================

/** User model type */
export type User = Prisma.UserGetPayload<{}>;

/** Group model type */
export type Group = Prisma.GroupGetPayload<{}>;

/** CreatedGroup model type */
export type CreatedGroup = Prisma.CreatedGroupGetPayload<{}>;

/** PastGroup model type */
export type PastGroup = Prisma.PastGroupGetPayload<{}>;

/** Expense model type */
export type Expense = Prisma.ExpenseGetPayload<{}>;

// ============================================
// User types with relations
// ============================================

/** User with minimal info for display purposes */
export type UserBasic = Pick<User, 'id' | 'name' | 'email'>;

/** User with minimal info for payer display */
export type PayerInfo = Pick<User, 'id' | 'name'>;

// ============================================
// Group types with relations
// ============================================

/** Group with member users (used by getUserGroup) */
export type GroupWithMembers = Group & {
  users: UserBasic[];
};

/** CreatedGroup join table with Group relation */
export type CreatedGroupWithGroup = CreatedGroup & {
  group: Group;
};

/** PastGroup join table with Group relation */
export type PastGroupWithGroup = PastGroup & {
  group: Group;
};

// ============================================
// Settings page data types
// ============================================

/** Data returned by getGroupSettingsData */
export type GroupSettingsData = User & {
  groups: Group[];
  createdGroups: CreatedGroupWithGroup[];
  pastGroups: PastGroupWithGroup[];
};

// ============================================
// Expense types with relations
// ============================================

/** Expense with user relation and payer alias */
export type ExpenseWithPayer = Expense & {
  user: PayerInfo;
  payer: PayerInfo;
  payerId: number;
};

