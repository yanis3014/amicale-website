-- Schéma PostgreSQL — Amicale FPHM
-- Exécuter une fois : psql $DATABASE_URL -f src/config/schema.sql

-- Extension pour gen_random_uuid si besoin
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Fonction trigger updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  annee INT CHECK (annee >= 1 AND annee <= 6),
  telephone VARCHAR(50),
  numero_membre VARCHAR(50) UNIQUE,
  is_adherent BOOLEAN NOT NULL DEFAULT false,
  adherent_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_adherent ON users(is_adherent);
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- 2. events
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  titre VARCHAR(500) NOT NULL,
  description TEXT,
  long_description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  prix DECIMAL(10, 2) NOT NULL DEFAULT 0,
  prix_adherent DECIMAL(10, 2),
  image_url VARCHAR(500),
  capacite INT NOT NULL DEFAULT 0,
  places_restantes INT NOT NULL DEFAULT 0,
  lieu VARCHAR(500),
  categorie VARCHAR(100),
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_is_published ON events(is_published);
CREATE INDEX idx_events_categorie ON events(categorie);
CREATE TRIGGER events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- 3. registrations
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  statut VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (statut IN ('pending', 'confirmed', 'cancelled')),
  montant_paye DECIMAL(10, 2),
  methode_paiement VARCHAR(100),
  reference_paiement VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_user_id ON registrations(user_id);
CREATE INDEX idx_registrations_statut ON registrations(statut);

-- 4. activities
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  content TEXT,
  category VARCHAR(50) NOT NULL CHECK (category IN ('projet', 'vie_etudiante', 'flash_info', 'evenement', 'partenariat')),
  main_image VARCHAR(500),
  gallery_images JSONB NOT NULL DEFAULT '[]',
  author_id INT REFERENCES users(id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_activities_is_published ON activities(is_published);
CREATE INDEX idx_activities_category ON activities(category);
CREATE TRIGGER activities_updated_at BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- 5. enseignants
CREATE TABLE enseignants (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  titre VARCHAR(255),
  specialite VARCHAR(255),
  email VARCHAR(255),
  linkedin VARCHAR(500),
  photo_url VARCHAR(500),
  ordre INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_enseignants_ordre ON enseignants(ordre);
CREATE INDEX idx_enseignants_is_active ON enseignants(is_active);
CREATE TRIGGER enseignants_updated_at BEFORE UPDATE ON enseignants
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

-- 6. cotisations
CREATE TABLE cotisations (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  montant DECIMAL(10, 2) NOT NULL,
  annee_universitaire VARCHAR(20) NOT NULL,
  methode_paiement VARCHAR(100),
  reference VARCHAR(255),
  statut VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (statut IN ('pending', 'confirmed', 'rejected')),
  confirmed_by INT REFERENCES users(id) ON DELETE SET NULL,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_cotisations_user_id ON cotisations(user_id);
CREATE INDEX idx_cotisations_statut ON cotisations(statut);

-- Admin par défaut (à exécuter manuellement après création du schéma)
-- Mot de passe : Admin2026! (bcrypt). À changer en production.
-- INSERT INTO users (nom, prenom, email, password_hash, role, numero_membre)
-- VALUES ('Admin', 'FPHM', 'admin@fphm.tn', '$2b$12$...', 'admin', 'ADMIN-001');
