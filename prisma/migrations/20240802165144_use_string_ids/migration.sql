/*
  Warnings:

  - You are about to drop the column `guildId` on the `Guild` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Guild_guildId_key";

-- AlterTable
ALTER TABLE "Guild" DROP COLUMN "guildId";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
