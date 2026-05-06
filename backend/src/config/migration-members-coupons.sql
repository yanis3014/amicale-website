-- Migration : création membre par admin
-- À exécuter : psql $DATABASE_URL -f backend/src/config/migration-members-coupons.sql

-- 1. Traçabilité : membre créé par quel admin
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by_admin_id INT REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_users_created_by_admin ON users(created_by_admin_id);
