-- AlterTable
ALTER TABLE "PersonalBudget" ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recurringGroupId" TEXT;

-- CreateIndex
CREATE INDEX "PersonalBudget_userId_recurringGroupId_idx" ON "PersonalBudget"("userId", "recurringGroupId");
