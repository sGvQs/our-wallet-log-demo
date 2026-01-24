import { PersonalExpenseCategory } from '@prisma/client';

// Personal Expense Category labels (Japanese)
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

// Category colors for UI
export const CATEGORY_COLORS: Record<PersonalExpenseCategory, string> = {
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
