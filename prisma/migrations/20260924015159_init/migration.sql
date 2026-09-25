-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'RECEIVED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('PRODUCT', 'MATERIAL', 'SERVICE', 'LABOR', 'OTHER');

-- CreateEnum
CREATE TYPE "QuoteStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_verified_at" TIMESTAMP(3),
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "language" TEXT NOT NULL DEFAULT 'es',
    "timezone" TEXT NOT NULL DEFAULT 'America/Santiago',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_used_at" TIMESTAMP(3),
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "quote_prefix" TEXT NOT NULL DEFAULT 'COT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memberships" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "role" "OrganizationRole" NOT NULL DEFAULT 'MEMBER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_settings" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "trade_name" TEXT,
    "legal_name" TEXT,
    "tax_id" TEXT,
    "business_line" TEXT,
    "contact_email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "address" TEXT,
    "logo_url" TEXT,
    "primary_color" TEXT,
    "secondary_color" TEXT,
    "currency_code" TEXT NOT NULL DEFAULT 'CLP',
    "currency_symbol" TEXT NOT NULL DEFAULT '$',
    "tax_percentage" DECIMAL(5,2) NOT NULL DEFAULT 19.00,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "tax_id" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_contacts" (
    "id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "position" TEXT,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNING',
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalog_items" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "ItemCategory" NOT NULL DEFAULT 'PRODUCT',
    "code" TEXT,
    "unit" TEXT NOT NULL DEFAULT 'un',
    "supplier_reference" TEXT,
    "cost_price" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "sale_price" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalog_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_sequences" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "current_number" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_sequences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "project_id" UUID,
    "quote_number" INTEGER NOT NULL,
    "status" "QuoteStatus" NOT NULL DEFAULT 'DRAFT',
    "subtotal_cost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "subtotal_sale" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "tax_percentage" DECIMAL(5,2) NOT NULL DEFAULT 19.00,
    "tax_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "valid_until" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "accepted_at" TIMESTAMP(3),
    "rejected_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quote_items" (
    "id" UUID NOT NULL,
    "quote_id" UUID NOT NULL,
    "catalog_item_id" UUID,
    "position" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'un',
    "quantity" DECIMAL(12,3) NOT NULL DEFAULT 1,
    "unit_cost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "unit_price" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_cost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_price" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quote_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "user_preferences"("user_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE INDEX "memberships_user_id_idx" ON "memberships"("user_id");

-- CreateIndex
CREATE INDEX "memberships_organization_id_idx" ON "memberships"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "memberships_user_id_organization_id_key" ON "memberships"("user_id", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_settings_organization_id_key" ON "company_settings"("organization_id");

-- CreateIndex
CREATE INDEX "customers_organization_id_idx" ON "customers"("organization_id");

-- CreateIndex
CREATE INDEX "customers_organization_id_name_idx" ON "customers"("organization_id", "name");

-- CreateIndex
CREATE INDEX "customers_organization_id_tax_id_idx" ON "customers"("organization_id", "tax_id");

-- CreateIndex
CREATE INDEX "customers_organization_id_is_active_idx" ON "customers"("organization_id", "is_active");

-- CreateIndex
CREATE INDEX "customer_contacts_customer_id_idx" ON "customer_contacts"("customer_id");

-- CreateIndex
CREATE INDEX "projects_organization_id_idx" ON "projects"("organization_id");

-- CreateIndex
CREATE INDEX "projects_customer_id_idx" ON "projects"("customer_id");

-- CreateIndex
CREATE INDEX "projects_organization_id_status_idx" ON "projects"("organization_id", "status");

-- CreateIndex
CREATE INDEX "projects_organization_id_name_idx" ON "projects"("organization_id", "name");

-- CreateIndex
CREATE INDEX "catalog_items_organization_id_idx" ON "catalog_items"("organization_id");

-- CreateIndex
CREATE INDEX "catalog_items_organization_id_category_idx" ON "catalog_items"("organization_id", "category");

-- CreateIndex
CREATE INDEX "catalog_items_organization_id_name_idx" ON "catalog_items"("organization_id", "name");

-- CreateIndex
CREATE INDEX "catalog_items_organization_id_code_idx" ON "catalog_items"("organization_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "quote_sequences_organization_id_key" ON "quote_sequences"("organization_id");

-- CreateIndex
CREATE INDEX "quotes_organization_id_idx" ON "quotes"("organization_id");

-- CreateIndex
CREATE INDEX "quotes_customer_id_idx" ON "quotes"("customer_id");

-- CreateIndex
CREATE INDEX "quotes_project_id_idx" ON "quotes"("project_id");

-- CreateIndex
CREATE INDEX "quotes_organization_id_status_idx" ON "quotes"("organization_id", "status");

-- CreateIndex
CREATE INDEX "quotes_organization_id_created_at_idx" ON "quotes"("organization_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_organization_id_quote_number_key" ON "quotes"("organization_id", "quote_number");

-- CreateIndex
CREATE INDEX "quote_items_quote_id_idx" ON "quote_items"("quote_id");

-- CreateIndex
CREATE INDEX "quote_items_catalog_item_id_idx" ON "quote_items"("catalog_item_id");

-- CreateIndex
CREATE INDEX "quote_items_quote_id_position_idx" ON "quote_items"("quote_id", "position");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_settings" ADD CONSTRAINT "company_settings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_contacts" ADD CONSTRAINT "customer_contacts_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_items" ADD CONSTRAINT "catalog_items_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_sequences" ADD CONSTRAINT "quote_sequences_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_quote_id_fkey" FOREIGN KEY ("quote_id") REFERENCES "quotes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quote_items" ADD CONSTRAINT "quote_items_catalog_item_id_fkey" FOREIGN KEY ("catalog_item_id") REFERENCES "catalog_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;
