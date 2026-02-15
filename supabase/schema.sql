-- Schéma de base de données pour l'Amicale de la Faculté de Pharmacie

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table profiles (profils des étudiants et admins)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('etudiant', 'admin')) DEFAULT 'etudiant',
  annee INTEGER CHECK (annee BETWEEN 1 AND 6),
  telephone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table events (événements organisés par l'amicale)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  prix DECIMAL(10, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  capacite INTEGER NOT NULL DEFAULT 100,
  places_restantes INTEGER NOT NULL DEFAULT 100,
  lieu VARCHAR(255),
  categorie VARCHAR(50) CHECK (categorie IN ('conference', 'social', 'formation', 'autre')) DEFAULT 'autre',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table transactions (paiements)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  montant DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  id_etudiant UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  id_event UUID REFERENCES events(id) ON DELETE SET NULL,
  methode_paiement VARCHAR(20) NOT NULL CHECK (methode_paiement IN ('flouci', 'espece', 'virement')),
  reference_paiement VARCHAR(255),
  date_transaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table registrations (inscriptions aux événements)
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_etudiant UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  id_event UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status_paiement VARCHAR(20) NOT NULL CHECK (status_paiement IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  date_inscription TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte unique pour éviter les inscriptions multiples
  UNIQUE(id_etudiant, id_event)
);

-- Index pour optimiser les performances
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_categorie ON events(categorie);
CREATE INDEX idx_registrations_etudiant ON registrations(id_etudiant);
CREATE INDEX idx_registrations_event ON registrations(id_event);
CREATE INDEX idx_transactions_etudiant ON transactions(id_etudiant);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour décrémenter les places restantes lors d'une inscription
CREATE OR REPLACE FUNCTION decrement_places_restantes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status_paiement = 'completed' THEN
    UPDATE events 
    SET places_restantes = places_restantes - 1 
    WHERE id = NEW.id_event AND places_restantes > 0;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_registration_completed
  AFTER INSERT OR UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION decrement_places_restantes();

-- Fonction pour réincrémenter les places lors d'une annulation
CREATE OR REPLACE FUNCTION increment_places_restantes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status_paiement = 'completed' THEN
    UPDATE events 
    SET places_restantes = places_restantes + 1 
    WHERE id = OLD.id_event;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_registration_deleted
  BEFORE DELETE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION increment_places_restantes();

-- Table activities (actualités et activités de l'amicale)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('projet', 'vie_etudiante', 'flash_info', 'evenement', 'partenariat')) DEFAULT 'flash_info',
  main_image TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes activities
CREATE INDEX idx_activities_category ON activities(category);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_published_at ON activities(published_at);
CREATE INDEX idx_activities_author ON activities(author_id);

-- Trigger pour updated_at sur activities
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Données d'exemple (optionnel - à retirer en production)
-- INSERT INTO profiles (nom, prenom, email, role) VALUES
-- ('Admin', 'Test', 'admin@pharmacie.tn', 'admin'),
-- ('Dupont', 'Jean', 'jean.dupont@student.pharmacie.tn', 'etudiant');
