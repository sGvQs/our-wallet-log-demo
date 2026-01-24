-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "shop" TEXT,
ALTER COLUMN "description" DROP NOT NULL;
