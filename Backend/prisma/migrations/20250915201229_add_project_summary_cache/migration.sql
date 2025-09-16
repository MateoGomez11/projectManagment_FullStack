-- AlterTable
ALTER TABLE "public"."Project" ADD COLUMN     "summary" TEXT,
ADD COLUMN     "summaryAt" TIMESTAMP(3),
ADD COLUMN     "summaryHash" TEXT,
ADD COLUMN     "summaryLang" TEXT;
