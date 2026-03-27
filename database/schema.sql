CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

CREATE TABLE "AiGeneratedDesigns" (
    "Id" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "Prompt" text NOT NULL,
    "GeneratedAssetUrl" text NOT NULL,
    "MetadataJson" text NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone,
    CONSTRAINT "PK_AiGeneratedDesigns" PRIMARY KEY ("Id")
);

CREATE TABLE "AuditLogs" (
    "Id" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "UserId" uuid,
    "Action" text NOT NULL,
    "EntityName" text NOT NULL,
    "DataJson" text NOT NULL,
    "IpAddress" text NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone,
    CONSTRAINT "PK_AuditLogs" PRIMARY KEY ("Id")
);

CREATE TABLE "B2BBulkOrders" (
    "Id" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "CustomerId" uuid NOT NULL,
    "CsvFileUrl" text NOT NULL,
    "Status" text NOT NULL,
    "QuotedAmount" numeric(18,2) NOT NULL,
    "TaxExempt" boolean NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone,
    CONSTRAINT "PK_B2BBulkOrders" PRIMARY KEY ("Id")
);

CREATE TABLE "CmsSections" (
    "Id" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "SectionKey" text NOT NULL,
    "Title" text NOT NULL,
    "PayloadJson" text NOT NULL,
    "IsEnabled" boolean NOT NULL,
    "DisplayOrder" integer NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone,
    CONSTRAINT "PK_CmsSections" PRIMARY KEY ("Id")
);

CREATE TABLE "Orders" (
    "Id" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "CustomerId" uuid NOT NULL,
    "TotalAmount" numeric(18,2) NOT NULL,
    "Priority" integer NOT NULL,
    "IsExpress" boolean NOT NULL,
    "DueDateUtc" timestamp with time zone NOT NULL,
    "ProductionStage" integer NOT NULL,
    "Status" text NOT NULL,
    "DesignConfigurationJson" text NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone,
    CONSTRAINT "PK_Orders" PRIMARY KEY ("Id")
);

CREATE TABLE "PrintQueueItems" (
    "Id" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "OrderId" uuid NOT NULL,
    "AssignedToUserId" uuid,
    "QueuePosition" integer NOT NULL,
    "Priority" integer NOT NULL,
    "DueDateUtc" timestamp with time zone NOT NULL,
    "Stage" integer NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone,
    CONSTRAINT "PK_PrintQueueItems" PRIMARY KEY ("Id")
);

CREATE TABLE "Products" (
    "Id" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "Name" text NOT NULL,
    "Description" text NOT NULL,
    "BasePrice" numeric(18,2) NOT NULL,
    "IsVisible" boolean NOT NULL,
    "ModelUrl" text NOT NULL,
    "VendorId" uuid,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone,
    CONSTRAINT "PK_Products" PRIMARY KEY ("Id")
);

CREATE TABLE "RefreshTokens" (
    "Id" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "Token" text NOT NULL,
    "ExpiresAtUtc" timestamp with time zone NOT NULL,
    "IsRevoked" boolean NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone,
    CONSTRAINT "PK_RefreshTokens" PRIMARY KEY ("Id")
);

CREATE TABLE "Tenants" (
    "Id" uuid NOT NULL,
    "Name" text NOT NULL,
    "Slug" text NOT NULL,
    "Subdomain" text NOT NULL,
    "PrimaryColor" text NOT NULL,
    "SecondaryColor" text NOT NULL,
    "IsActive" boolean NOT NULL,
    "RoyaltyPercentage" numeric(5,2) NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone,
    CONSTRAINT "PK_Tenants" PRIMARY KEY ("Id")
);

CREATE TABLE "Users" (
    "Id" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "FullName" text NOT NULL,
    "Email" text NOT NULL,
    "PasswordHash" text NOT NULL,
    "Role" integer NOT NULL,
    "IsActive" boolean NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone,
    CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
);

CREATE TABLE "Vendors" (
    "Id" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "CompanyName" text NOT NULL,
    "ContactEmail" text NOT NULL,
    "IsApproved" boolean NOT NULL,
    "CommissionRate" numeric(5,2) NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone,
    CONSTRAINT "PK_Vendors" PRIMARY KEY ("Id")
);

CREATE TABLE "WarehouseItems" (
    "Id" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "Sku" text NOT NULL,
    "Name" text NOT NULL,
    "QuantityInStock" numeric(18,3) NOT NULL,
    "ReorderThreshold" numeric(18,3) NOT NULL,
    "Unit" text NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone,
    CONSTRAINT "PK_WarehouseItems" PRIMARY KEY ("Id")
);

CREATE TABLE "OrderItems" (
    "Id" uuid NOT NULL,
    "TenantId" uuid NOT NULL,
    "OrderId" uuid NOT NULL,
    "ProductId" uuid NOT NULL,
    "Quantity" integer NOT NULL,
    "UnitPrice" numeric(18,2) NOT NULL,
    "CreatedAtUtc" timestamp with time zone NOT NULL,
    "UpdatedAtUtc" timestamp with time zone,
    CONSTRAINT "PK_OrderItems" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_OrderItems_Orders_OrderId" FOREIGN KEY ("OrderId") REFERENCES "Orders" ("Id") ON DELETE CASCADE
);

INSERT INTO "Tenants" ("Id", "CreatedAtUtc", "IsActive", "Name", "PrimaryColor", "RoyaltyPercentage", "SecondaryColor", "Slug", "Subdomain", "UpdatedAtUtc")
VALUES ('11111111-1111-1111-1111-111111111111', TIMESTAMPTZ '2026-02-24T07:55:42.680229Z', TRUE, 'Default Tenant', '#00D4FF', 5.0, '#7F5AF0', 'default-tenant', 'default', NULL);

CREATE INDEX "IX_OrderItems_OrderId" ON "OrderItems" ("OrderId");

CREATE UNIQUE INDEX "IX_Users_TenantId_Email" ON "Users" ("TenantId", "Email");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260224075543_InitialCreatePostgres', '8.0.12');

COMMIT;

