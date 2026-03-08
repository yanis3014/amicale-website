-- Migration : événements à la une (page d'accueil)
-- À exécuter si la base existe déjà : psql $DATABASE_URL -f src/config/migration-events-featured.sql

ALTER TABLE events ADD COLUMN IF NOT EXISTS featured_on_home BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE events ADD COLUMN IF NOT EXISTS home_order INT NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_events_featured_on_home ON events(featured_on_home);
