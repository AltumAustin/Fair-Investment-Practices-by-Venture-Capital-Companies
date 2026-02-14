-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED');

-- AlterTable: Add stripeCustomerId to VCFirm
ALTER TABLE "VCFirm" ADD COLUMN "stripeCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "VCFirm_stripeCustomerId_key" ON "VCFirm"("stripeCustomerId");

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "vcFirmId" TEXT NOT NULL,
    "stripeCheckoutId" TEXT,
    "stripePaymentIntentId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "reportYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripeCheckoutId_key" ON "Payment"("stripeCheckoutId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripePaymentIntentId_key" ON "Payment"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_vcFirmId_reportYear_key" ON "Payment"("vcFirmId", "reportYear");

-- CreateIndex
CREATE INDEX "Payment_vcFirmId_idx" ON "Payment"("vcFirmId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_vcFirmId_fkey" FOREIGN KEY ("vcFirmId") REFERENCES "VCFirm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
