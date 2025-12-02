-- Migration: Add Unvan table
-- Date: 2024
-- Description: Creates the Unvan (Title/Position) table for managing job titles

-- Create Unvan table
CREATE TABLE IF NOT EXISTS "Unvan" (
    "UnvanID" SERIAL PRIMARY KEY,
    "UnvanAdi" VARCHAR(100) NOT NULL,
    "Aciklama" VARCHAR(500),
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "CreatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index on UnvanAdi
CREATE UNIQUE INDEX IF NOT EXISTS idx_unvan_adi_unique ON "Unvan" ("UnvanAdi");

-- Create index on IsActive for filtering
CREATE INDEX IF NOT EXISTS idx_unvan_active ON "Unvan" ("IsActive");

-- Insert some default unvanlar (optional)
INSERT INTO "Unvan" ("UnvanAdi", "Aciklama", "IsActive") VALUES
    ('Uzman', 'Uzman personel', TRUE),
    ('Müdür', 'Birim müdürü', TRUE),
    ('Şef', 'Birim şefi', TRUE),
    ('Memur', 'Memur personel', TRUE),
    ('Mühendis', 'Mühendis personel', TRUE),
    ('Teknisyen', 'Teknisyen personel', TRUE)
ON CONFLICT DO NOTHING;

-- Add Unvan permissions to Permission table
INSERT INTO "Permission" ("PermissionName", "Aciklama", "Resource", "Action") VALUES
    ('manage.unvan', 'Ünvan yönetimi tam yetkisi', 'unvan', 'manage'),
    ('create.unvan', 'Ünvan oluşturma yetkisi', 'unvan', 'create'),
    ('read.unvan', 'Ünvan görüntüleme yetkisi', 'unvan', 'read'),
    ('update.unvan', 'Ünvan güncelleme yetkisi', 'unvan', 'update'),
    ('delete.unvan', 'Ünvan silme yetkisi', 'unvan', 'delete')
ON CONFLICT DO NOTHING;

-- Grant all Unvan permissions to SuperAdmin role (RoleID = 1 typically)
-- Adjust the RoleID based on your actual SuperAdmin role ID
INSERT INTO "RolePermission" ("RoleID", "PermissionID")
SELECT 1, "PermissionID" FROM "Permission" WHERE "Resource" = 'unvan'
ON CONFLICT DO NOTHING;
