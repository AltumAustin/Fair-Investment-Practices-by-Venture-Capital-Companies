-- AlterTable: Add vcFirmId column to PortfolioCompany
-- First add as nullable, backfill existing rows, then make NOT NULL

ALTER TABLE "PortfolioCompany" ADD COLUMN "vcFirmId" TEXT;

-- Backfill: assign existing portfolio companies to the VC firm that has investments in them
UPDATE "PortfolioCompany" pc
SET "vcFirmId" = (
  SELECT i."vcFirmId"
  FROM "Investment" i
  WHERE i."portfolioCompanyId" = pc.id
  LIMIT 1
)
WHERE pc."vcFirmId" IS NULL;

-- For any remaining orphaned companies (no investments), assign to the first VC firm
UPDATE "PortfolioCompany"
SET "vcFirmId" = (SELECT id FROM "VCFirm" LIMIT 1)
WHERE "vcFirmId" IS NULL;

-- Now make the column required
ALTER TABLE "PortfolioCompany" ALTER COLUMN "vcFirmId" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE "PortfolioCompany" ADD CONSTRAINT "PortfolioCompany_vcFirmId_fkey" FOREIGN KEY ("vcFirmId") REFERENCES "VCFirm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add index for performance
CREATE INDEX "PortfolioCompany_vcFirmId_idx" ON "PortfolioCompany"("vcFirmId");
