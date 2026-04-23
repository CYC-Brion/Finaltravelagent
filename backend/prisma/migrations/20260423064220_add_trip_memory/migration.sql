-- CreateTable
CREATE TABLE "TripMemory" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "userId" TEXT,
    "memoryType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripMemory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TripMemory_tripId_idx" ON "TripMemory"("tripId");

-- CreateIndex
CREATE INDEX "TripMemory_userId_idx" ON "TripMemory"("userId");
