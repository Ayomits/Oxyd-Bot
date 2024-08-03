-- CreateEnum
CREATE TYPE "Languages" AS ENUM ('RUSSIAN', 'ENGLISH');

-- AlterTable
ALTER TABLE "Guild" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "language" "Languages" NOT NULL DEFAULT 'ENGLISH',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "LogSettings" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "message" TEXT,
    "voice" TEXT,
    "roles" TEXT,
    "members" TEXT,

    CONSTRAINT "LogSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LogSettings_guildId_key" ON "LogSettings"("guildId");

-- AddForeignKey
ALTER TABLE "LogSettings" ADD CONSTRAINT "LogSettings_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
