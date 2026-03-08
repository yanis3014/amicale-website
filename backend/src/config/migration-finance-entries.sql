-- Entrées manuelles (sponsors, dons, autre) — traçables par admin
-- À exécuter : psql $DATABASE_URL -f src/config/migration-finance-entries.sql

CREATE TABLE IF NOT EXISTS finance_entries (
  id SERIAL PRIMARY KEY,
  montant DECIMAL(10, 2) NOT NULL CHECK (montant > 0),
  libelle VARCHAR(500) NOT NULL,
  type_entree VARCHAR(50) NOT NULL DEFAULT 'sponsor' CHECK (type_entree IN ('sponsor', 'don', 'autre')),
  date_entree DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_finance_entries_date ON finance_entries(date_entree DESC);
CREATE INDEX IF NOT EXISTS idx_finance_entries_type ON finance_entries(type_entree);
CREATE INDEX IF NOT EXISTS idx_finance_entries_created_by ON finance_entries(created_by);

CREATE TRIGGER finance_entries_updated_at
  BEFORE UPDATE ON finance_entries
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
