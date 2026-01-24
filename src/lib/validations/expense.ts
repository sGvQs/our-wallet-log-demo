import { z } from 'zod';

// ExpenseCategory enum values (matching Prisma schema)
export const ExpenseCategoryEnum = z.enum([
  'FOOD',
  'HOUSING',
  'UTILITIES',
  'DAILY',
  'TRAVEL',
  'ENTERTAINMENT',
  'OTHER',
]);

export type ExpenseCategoryType = z.infer<typeof ExpenseCategoryEnum>;

// Expense form validation schema
export const expenseFormSchema = z.object({
  amount: z
    .number({ message: '金額を入力してください' })
    .min(1, '金額は1円以上で入力してください')
    .max(100000000, '金額が大きすぎます'),
  description: z
    .string()
    .max(10, '内容は10文字以内で入力してください'),
  shop: z
    .string()
    .max(10, '店名は10文字以内で入力してください'),
  category: ExpenseCategoryEnum,
  year: z.number().min(2020).max(2100),
  month: z.number().min(1).max(12),
  day: z.number().min(1).max(31),
});

export type ExpenseFormData = z.infer<typeof expenseFormSchema>;

// Default values for new expense
export const defaultExpenseFormValues: ExpenseFormData = {
  amount: 0,
  description: '',
  shop: '',
  category: 'FOOD',
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  day: new Date().getDate(),
};
