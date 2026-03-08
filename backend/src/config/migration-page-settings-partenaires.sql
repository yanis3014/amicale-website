-- Migration : page_settings + partenaires
-- À exécuter si la base existe déjà : psql $DATABASE_URL -f src/config/migration-page-settings-partenaires.sql

-- page_settings (header enseignants, etc.)
CREATE TABLE IF NOT EXISTS page_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE TRIGGER page_settings_updated_at
  BEFORE UPDATE ON page_settings
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- partenaires
CREATE TABLE IF NOT EXISTS partenaires (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  url VARCHAR(500),
  ordre INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_partenaires_ordre ON partenaires(ordre);
CREATE INDEX IF NOT EXISTS idx_partenaires_is_active ON partenaires(is_active);
CREATE TRIGGER partenaires_updated_at
  BEFORE UPDATE ON partenaires
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
