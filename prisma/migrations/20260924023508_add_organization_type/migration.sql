-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('PERSONAL', 'BUSINESS');

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "type" "OrganizationType" NOT NULL DEFAULT 'BUSINESS';
