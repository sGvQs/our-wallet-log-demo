-- CreateEnum
CREATE TYPE "PersonalExpenseCategory" AS ENUM ('ALL', 'FOOD', 'HOUSING', 'UTILITIES', 'DAILY', 'TRAVEL', 'ENTERTAINMENT', 'HOBBY', 'CLOTHING', 'BEAUTY', 'MEDICAL', 'EDUCATION', 'GIFTS', 'SUBSCRIPTION', 'SAVINGS', 'OTHER');

-- CreateTable
CREATE TABLE "PersonalExpense" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT,
    "shop" TEXT,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" "PersonalExpenseCategory" NOT NULL DEFAULT 'OTHER',
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonalBudget" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "targetMonth" INTEGER NOT NULL,
    "targetYear" INTEGER NOT NULL,
    "category" "PersonalExpenseCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalBudget_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PersonalExpense_userId_date_idx" ON "PersonalExpense"("userId", "date");

-- AddForeignKey
ALTER TABLE "PersonalExpense" ADD CONSTRAINT "PersonalExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalBudget" ADD CONSTRAINT "PersonalBudget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
