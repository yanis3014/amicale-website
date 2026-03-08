-- Galerie photos pour les événements passés (annonces)
-- Exécuter : psql $DATABASE_URL -f migrations/001_add_events_gallery.sql

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS gallery_images JSONB NOT NULL DEFAULT '[]';

COMMENT ON COLUMN events.gallery_images IS 'URLs des photos de la galerie (événement passé = annonce)';
