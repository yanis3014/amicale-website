-- Migration : journal d'audit + identifiants opérateurs
-- À exécuter : psql $DATABASE_URL -f backend/src/config/migration-audit-operateurs.sql

-- Colonne identifiant pour les comptes admin (admin principal = NULL, opérateurs = OP01..OP09)
ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_identifier VARCHAR(20) UNIQUE;

-- Table des actions enregistrées (qui a fait quoi, quand)
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_email VARCHAR(255),
  admin_identifier VARCHAR(20),
  action VARCHAR(100) NOT NULL,
  method VARCHAR(10) NOT NULL,
  path VARCHAR(500) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(100),
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_admin_identifier ON audit_log(admin_identifier);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
