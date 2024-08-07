/*
  Warnings:

  - You are about to drop the column `members` on the `LogSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LogSettings" DROP COLUMN "members",
ADD COLUMN     "joins" TEXT;
