-- Migration : création membre par admin + coupons de réduction
-- À exécuter : psql $DATABASE_URL -f backend/src/config/migration-members-coupons.sql

-- 1. Traçabilité : membre créé par quel admin
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by_admin_id INT REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_users_created_by_admin ON users(created_by_admin_id);

-- 2. Table des coupons de réduction
CREATE TABLE IF NOT EXISTS coupons (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  type_coupon VARCHAR(20) NOT NULL CHECK (type_coupon IN ('adhesion', 'event')),
  discount_type VARCHAR(10) NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
  discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
  event_id INT REFERENCES events(id) ON DELETE CASCADE,
  created_by_admin_id INT NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  max_uses INT,
  use_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT chk_coupon_event CHECK (
    (type_coupon = 'event' AND event_id IS NOT NULL) OR (type_coupon = 'adhesion' AND event_id IS NULL)
  )
);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_type ON coupons(type_coupon);
CREATE INDEX IF NOT EXISTS idx_coupons_created_by ON coupons(created_by_admin_id);

-- 3. Lien cotisation -> coupon utilisé
ALTER TABLE cotisations ADD COLUMN IF NOT EXISTS coupon_id INT REFERENCES coupons(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_cotisations_coupon ON cotisations(coupon_id);

-- 4. Lien inscription événement -> coupon utilisé
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS coupon_id INT REFERENCES coupons(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_registrations_coupon ON registrations(coupon_id);
