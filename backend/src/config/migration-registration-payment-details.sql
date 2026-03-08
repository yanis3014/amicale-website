-- Migration : infos carte (paiement simulé) sur les inscriptions événements
-- À exécuter : psql $DATABASE_URL -f backend/src/config/migration-registration-payment-details.sql
-- On ne stocke jamais le numéro complet ni le CVV, uniquement : nom sur carte, derniers 4 chiffres (dans reference_paiement), date expiration.

ALTER TABLE registrations ADD COLUMN IF NOT EXISTS titulaire_compte VARCHAR(255);
ALTER TABLE registrations ADD COLUMN IF NOT EXISTS carte_expiry VARCHAR(10);
