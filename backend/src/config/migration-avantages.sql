-- Migration : avantages adhérent (liste gérée en admin)
-- À exécuter si la base existe déjà : psql $DATABASE_URL -f src/config/migration-avantages.sql

CREATE TABLE IF NOT EXISTS avantages (
  id SERIAL PRIMARY KEY,
  libelle VARCHAR(500) NOT NULL,
  type_avantage VARCHAR(50) NOT NULL DEFAULT 'avantage' CHECK (type_avantage IN ('avantage', 'reduction', 'autre')),
  ordre INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_avantages_ordre ON avantages(ordre);
CREATE INDEX IF NOT EXISTS idx_avantages_is_active ON avantages(is_active);
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'avantages_updated_at') THEN
    CREATE TRIGGER avantages_updated_at BEFORE UPDATE ON avantages
      FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
  END IF;
END $$;
