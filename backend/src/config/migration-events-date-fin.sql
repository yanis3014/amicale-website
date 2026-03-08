-- Date de fin pour les annonces : l'événement reste en "annonces" jusqu'à date_fin, puis passe en "événements passés"
-- À exécuter : psql $DATABASE_URL -f src/config/migration-events-date-fin.sql

ALTER TABLE events ADD COLUMN IF NOT EXISTS date_fin TIMESTAMP WITH TIME ZONE;
CREATE INDEX IF NOT EXISTS idx_events_date_fin ON events(date_fin);
