import { ExpenseCategory, PersonalExpenseCategory } from "@prisma/client";

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

  export const PERSONAL_CATEGORIES: Record<PersonalExpenseCategory, string> = {
    ALL: 'すべて',
    FOOD: '食費',
    HOUSING: '家賃',
    UTILITIES: '光熱費',
    DAILY: '日用品',
    TRAVEL: '旅行費',
    ENTERTAINMENT: 'お楽しみ費',
    HOBBY: '趣味',
    CLOTHING: '服',
    BEAUTY: 'コスメ',
    MEDICAL: '薬',
    EDUCATION: '自己投資',
    GIFTS: 'プレゼント',
    SUBSCRIPTION: 'サブスク',
    SAVINGS: '貯金',
    OTHER: 'その他',
  };