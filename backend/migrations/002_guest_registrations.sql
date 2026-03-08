-- Inscriptions invités : user_id nullable + champs invité
-- Exécuter sur une base existante : psql $DATABASE_URL -f migrations/002_guest_registrations.sql

-- Rendre user_id nullable (pour inscriptions sans compte)
ALTER TABLE registrations ALTER COLUMN user_id DROP NOT NULL;

-- Colonnes pour les invités (quand user_id IS NULL)
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS guest_nom VARCHAR(255),
  ADD COLUMN IF NOT EXISTS guest_prenom VARCHAR(255),
  ADD COLUMN IF NOT EXISTS guest_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS guest_telephone VARCHAR(50);

-- Contrainte : soit user_id soit (guest_nom, guest_prenom, guest_email) renseignés
-- (vérification côté app pour l'instant)

-- Remplacer l'ancien UNIQUE(user_id, event_id) par des index partiels
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_user_id_event_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_event_user
  ON registrations (event_id, user_id) WHERE user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_event_guest_email
  ON registrations (event_id, guest_email) WHERE user_id IS NULL AND guest_email IS NOT NULL;
