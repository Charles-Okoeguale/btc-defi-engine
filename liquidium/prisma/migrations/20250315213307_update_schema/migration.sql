/*
  Warnings:

  - You are about to drop the column `number` on the `Ordinal` table. All the data in the column will be lost.
  - Added the required column `ltv` to the `Offer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inscriptionNumber` to the `Ordinal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerWalletAddr` to the `Ordinal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Offer" ADD COLUMN     "ltv" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Ordinal" DROP COLUMN "number",
ADD COLUMN     "contentUrl" TEXT,
ADD COLUMN     "inscriptionNumber" INTEGER NOT NULL,
ADD COLUMN     "lastSalePrice" DOUBLE PRECISION,
ADD COLUMN     "ownerWalletAddr" TEXT NOT NULL,
ADD COLUMN     "renderUrl" TEXT;

-- CreateIndex
CREATE INDEX "Offer_status_idx" ON "Offer"("status");
