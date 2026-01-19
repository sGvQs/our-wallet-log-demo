/*
  Warnings:

  - The `category` column on the `Expense` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('ALL', 'FOOD', 'HOUSING', 'UTILITIES', 'DAILY', 'TRAVEL', 'ENTERTAINMENT', 'OTHER');

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "category",
ADD COLUMN     "category" "ExpenseCategory" NOT NULL DEFAULT 'OTHER';

-- CreateIndex
CREATE INDEX "Expense_groupId_idx" ON "Expense"("groupId");

-- CreateIndex
CREATE INDEX "Expense_userId_date_idx" ON "Expense"("userId", "date");
