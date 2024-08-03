-- CreateTable
CREATE TABLE "Guild" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guild_guildId_key" ON "Guild"("guildId");
