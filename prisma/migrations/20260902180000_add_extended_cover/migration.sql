-- AlterTable
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "extendedExpiry" TIMESTAMP(3);
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "extendedType" TEXT;
