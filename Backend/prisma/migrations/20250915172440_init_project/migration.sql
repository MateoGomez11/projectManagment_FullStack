-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('IN_PROGRESS', 'FINALIZED');

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'FINALIZED',
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
