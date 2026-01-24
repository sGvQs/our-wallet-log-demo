import { ExpenseCategory, PersonalExpenseCategory } from '@prisma/client';

// =============================================================================
// Family (Shared) Expense Categories
// =============================================================================

export const FAMILY_CATEGORIES: Record<ExpenseCategory, string> = {
  ALL: 'すべて',
  FOOD: '食費',
  HOUSING: '家賃',
  UTILITIES: '光熱費',
  DAILY: '日用品',
  TRAVEL: '旅行費',
  ENTERTAINMENT: 'お楽しみ費',
  OTHER: 'その他',
};

export const FAMILY_CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  ALL: 'var(--color-text-main)',
  FOOD: '#FF6B6B',
  HOUSING: '#4D96FF',
  UTILITIES: '#FFD93D',
  DAILY: '#6BCB77',
  TRAVEL: '#9D4EDD',
  ENTERTAINMENT: '#FF9F1C',
  OTHER: '#8D99AE',
};

// =============================================================================
// Personal Expense Categories
// =============================================================================

export const PERSONAL_CATEGORIES: Record<PersonalExpenseCategory, string> = {
  ALL: 'すべて',
  FOOD: '食費',
  HOUSING: '住居費',
  UTILITIES: '光熱費',
  DAILY: '日用品',
  TRAVEL: '交通費',
  ENTERTAINMENT: '娯楽',
  HOBBY: '趣味',
  CLOTHING: '衣服',
  BEAUTY: '美容',
  MEDICAL: '医療',
  EDUCATION: '教育',
  GIFTS: '贈答',
  SUBSCRIPTION: 'サブスク',
  SAVINGS: '貯金',
  OTHER: 'その他',
};

export const PERSONAL_CATEGORY_COLORS: Record<PersonalExpenseCategory, string> = {
  ALL: '#888888',
  FOOD: '#e74c3c',
  HOUSING: '#3498db',
  UTILITIES: '#9b59b6',
  DAILY: '#1abc9c',
  TRAVEL: '#f39c12',
  ENTERTAINMENT: '#e91e63',
  HOBBY: '#00bcd4',
  CLOTHING: '#ff5722',
  BEAUTY: '#e91e63',
  MEDICAL: '#4caf50',
  EDUCATION: '#2196f3',
  GIFTS: '#ff9800',
  SUBSCRIPTION: '#673ab7',
  SAVINGS: '#27ae60',
  OTHER: '#95a5a6',
};

// =============================================================================
// Utility Types
// =============================================================================

export type CategoryType = 'family' | 'personal';

export function getCategoryLabels(type: CategoryType) {
  return type === 'family' ? FAMILY_CATEGORIES : PERSONAL_CATEGORIES;
}

export function getCategoryColors(type: CategoryType) {
  return type === 'family' ? FAMILY_CATEGORY_COLORS : PERSONAL_CATEGORY_COLORS;
}
