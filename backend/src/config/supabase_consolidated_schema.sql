-- =============================================================================
-- Amicale FPHM — schéma PostgreSQL complet (audit code : controllers + services)
-- =============================================================================
-- À exécuter dans Supabase SQL Editor sur une base où vous pouvez SUPPRIMER
-- les anciennes tables Amicale (projet vide ou reset volontaire).
--
-- Étapes :
--   1) DROP des tables métier (ordre sécurisé + CASCADE)
--   2) Fonction trigger set_updated_at
--   3) CREATE TABLE avec toutes les colonnes utilisées par le backend Express
--
-- Référence audit : backend/src/controllers/*.js, middleware/authMiddleware.js,
--                   services/auditService.js
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. Suppression des objets métier existants (repartir à zéro)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS public.audit_log CASCADE;
DROP TABLE IF EXISTS public.finance_entries CASCADE;
DROP TABLE IF EXISTS public.registrations CASCADE;
DROP TABLE IF EXISTS public.cotisations CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.enseignants CASCADE;
DROP TABLE IF EXISTS public.page_settings CASCADE;
DROP TABLE IF EXISTS public.partenaires CASCADE;
DROP TABLE IF EXISTS public.avantages CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

DROP FUNCTION IF EXISTS public.set_updated_at() CASCADE;

-- -----------------------------------------------------------------------------
-- 1. Fonction (avant tout trigger qui l’emploie)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- 2. users — authController, memberController, authMiddleware, auditController,
--            financeController (jointures), adminController (agrégats), emailController
--    Colonnes : id, nom, prenom, email, password_hash, role, annee, telephone,
--               numero_membre, is_adherent, adherent_expires_at, admin_identifier,
--               created_by_admin_id, created_at, updated_at
-- -----------------------------------------------------------------------------
CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  prenom VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  CONSTRAINT users_role_chk CHECK (role IN ('member', 'admin')),
  annee INT,
  CONSTRAINT users_annee_chk CHECK (annee IS NULL OR (annee >= 1 AND annee <= 6)),
  telephone VARCHAR(50),
  numero_membre VARCHAR(50),
  is_adherent BOOLEAN NOT NULL DEFAULT false,
  adherent_expires_at TIMESTAMPTZ,
  admin_identifier VARCHAR(20),
  created_by_admin_id INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_email_unique UNIQUE (email),
  CONSTRAINT users_numero_membre_unique UNIQUE (numero_membre),
  CONSTRAINT users_admin_identifier_unique UNIQUE (admin_identifier),
  CONSTRAINT users_created_by_fk FOREIGN KEY (created_by_admin_id)
    REFERENCES public.users (id) ON DELETE SET NULL
);

CREATE INDEX idx_users_role ON public.users (role);
CREATE INDEX idx_users_is_adherent ON public.users (is_adherent);
CREATE INDEX idx_users_created_by_admin ON public.users (created_by_admin_id);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 3. events — eventController (SELECT/INSERT/UPDATE listant date_fin,
--             is_published, featured_on_home, home_order, gallery_images, …)
-- -----------------------------------------------------------------------------
CREATE TABLE public.events (
  id SERIAL PRIMARY KEY,
  titre VARCHAR(500) NOT NULL,
  description TEXT,
  long_description TEXT,
  date TIMESTAMPTZ NOT NULL,
  date_fin TIMESTAMPTZ,
  prix DECIMAL(10, 2) NOT NULL DEFAULT 0,
  prix_adherent DECIMAL(10, 2),
  image_url VARCHAR(500),
  gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  capacite INT NOT NULL DEFAULT 0,
  places_restantes INT NOT NULL DEFAULT 0,
  lieu VARCHAR(500),
  categorie VARCHAR(100),
  is_published BOOLEAN NOT NULL DEFAULT false,
  featured_on_home BOOLEAN NOT NULL DEFAULT false,
  home_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_date ON public.events (date);
CREATE INDEX idx_events_date_fin ON public.events (date_fin);
CREATE INDEX idx_events_featured_on_home ON public.events (featured_on_home);
CREATE INDEX idx_events_is_published ON public.events (is_published);
CREATE INDEX idx_events_categorie ON public.events (categorie);

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 4. registrations — eventController INSERT/UPDATE/SELECT + jointures cotisations/events
-- -----------------------------------------------------------------------------
CREATE TABLE public.registrations (
  id SERIAL PRIMARY KEY,
  user_id INT,
  CONSTRAINT registrations_user_fk FOREIGN KEY (user_id)
    REFERENCES public.users (id) ON DELETE CASCADE,
  event_id INT NOT NULL,
  CONSTRAINT registrations_event_fk FOREIGN KEY (event_id)
    REFERENCES public.events (id) ON DELETE CASCADE,
  statut VARCHAR(20) NOT NULL DEFAULT 'pending',
  CONSTRAINT registrations_statut_chk CHECK (statut IN ('pending', 'confirmed', 'cancelled')),
  montant_paye DECIMAL(10, 2),
  methode_paiement VARCHAR(100),
  reference_paiement VARCHAR(255),
  titulaire_compte VARCHAR(255),
  carte_expiry VARCHAR(10),
  guest_nom VARCHAR(255),
  guest_prenom VARCHAR(255),
  guest_email VARCHAR(255),
  guest_telephone VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT registrations_owner_chk CHECK (
    user_id IS NOT NULL
    OR (
      guest_nom IS NOT NULL
      AND guest_prenom IS NOT NULL
      AND guest_email IS NOT NULL
    )
  )
);

CREATE INDEX idx_registrations_event_id ON public.registrations (event_id);
CREATE INDEX idx_registrations_user_id ON public.registrations (user_id);
CREATE INDEX idx_registrations_statut ON public.registrations (statut);
CREATE UNIQUE INDEX idx_registrations_event_user
  ON public.registrations (event_id, user_id)
  WHERE user_id IS NOT NULL;
CREATE UNIQUE INDEX idx_registrations_event_guest_email
  ON public.registrations (event_id, guest_email)
  WHERE user_id IS NULL AND guest_email IS NOT NULL;

-- -----------------------------------------------------------------------------
-- 5. activities — activityController (liste, CRUD, publish, galerie)
-- -----------------------------------------------------------------------------
CREATE TABLE public.activities (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  summary TEXT,
  content TEXT,
  category VARCHAR(50) NOT NULL,
  CONSTRAINT activities_category_chk CHECK (
    category IN ('projet', 'vie_etudiante', 'flash_info', 'evenement', 'partenariat')
  ),
  main_image VARCHAR(500),
  gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  author_id INT,
  CONSTRAINT activities_author_fk FOREIGN KEY (author_id)
    REFERENCES public.users (id) ON DELETE SET NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activities_is_published ON public.activities (is_published);
CREATE INDEX idx_activities_category ON public.activities (category);

CREATE TRIGGER activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 6. enseignants — enseignantController (SELECT *, CRUD, ordre, photo)
-- -----------------------------------------------------------------------------
CREATE TABLE public.enseignants (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  titre VARCHAR(255),
  specialite VARCHAR(255),
  email VARCHAR(255),
  linkedin VARCHAR(500),
  photo_url VARCHAR(500),
  ordre INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_enseignants_ordre ON public.enseignants (ordre);
CREATE INDEX idx_enseignants_is_active ON public.enseignants (is_active);

CREATE TRIGGER enseignants_updated_at
  BEFORE UPDATE ON public.enseignants
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 7. cotisations — cotisationController (submit, liste admin avec c.*, confirm/reject)
-- -----------------------------------------------------------------------------
CREATE TABLE public.cotisations (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  CONSTRAINT cotisations_user_fk FOREIGN KEY (user_id)
    REFERENCES public.users (id) ON DELETE CASCADE,
  montant DECIMAL(10, 2) NOT NULL,
  annee_universitaire VARCHAR(20) NOT NULL,
  methode_paiement VARCHAR(100),
  reference VARCHAR(255),
  statut VARCHAR(20) NOT NULL DEFAULT 'pending',
  CONSTRAINT cotisations_statut_chk CHECK (statut IN ('pending', 'confirmed', 'rejected')),
  confirmed_by INT,
  CONSTRAINT cotisations_confirmed_by_fk FOREIGN KEY (confirmed_by)
    REFERENCES public.users (id) ON DELETE SET NULL,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_cotisations_user_id ON public.cotisations (user_id);
CREATE INDEX idx_cotisations_statut ON public.cotisations (statut);

-- -----------------------------------------------------------------------------
-- 8. page_settings — pageSettingsController (get value, UPSERT key/value)
-- -----------------------------------------------------------------------------
CREATE TABLE public.page_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER page_settings_updated_at
  BEFORE UPDATE ON public.page_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 9. partenaires — partenaireController
-- -----------------------------------------------------------------------------
CREATE TABLE public.partenaires (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  logo_url VARCHAR(500),
  url VARCHAR(500),
  ordre INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_partenaires_ordre ON public.partenaires (ordre);
CREATE INDEX idx_partenaires_is_active ON public.partenaires (is_active);

CREATE TRIGGER partenaires_updated_at
  BEFORE UPDATE ON public.partenaires
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 10. avantages — avantageController
-- -----------------------------------------------------------------------------
CREATE TABLE public.avantages (
  id SERIAL PRIMARY KEY,
  libelle VARCHAR(500) NOT NULL,
  type_avantage VARCHAR(50) NOT NULL DEFAULT 'avantage',
  CONSTRAINT avantages_type_chk CHECK (
    type_avantage IN ('avantage', 'reduction', 'autre')
  ),
  ordre INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_avantages_ordre ON public.avantages (ordre);
CREATE INDEX idx_avantages_is_active ON public.avantages (is_active);

CREATE TRIGGER avantages_updated_at
  BEFORE UPDATE ON public.avantages
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- -----------------------------------------------------------------------------
-- 11. audit_log — auditController SELECT + auditService INSERT
--             user_id NULLABLE : log invité (eventController register-guest)
-- -----------------------------------------------------------------------------
CREATE TABLE public.audit_log (
  id SERIAL PRIMARY KEY,
  user_id INT,
  CONSTRAINT audit_log_user_fk FOREIGN KEY (user_id)
    REFERENCES public.users (id) ON DELETE CASCADE,
  user_email VARCHAR(255),
  admin_identifier VARCHAR(20),
  action VARCHAR(100) NOT NULL,
  method VARCHAR(10) NOT NULL,
  path VARCHAR(500) NOT NULL,
  resource_type VARCHAR(50),
  resource_id VARCHAR(100),
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user_id ON public.audit_log (user_id);
CREATE INDEX idx_audit_log_admin_identifier ON public.audit_log (admin_identifier);
CREATE INDEX idx_audit_log_created_at ON public.audit_log (created_at DESC);
CREATE INDEX idx_audit_log_action ON public.audit_log (action);

-- -----------------------------------------------------------------------------
-- 12. finance_entries — financeController (overview, list, CRUD)
-- -----------------------------------------------------------------------------
CREATE TABLE public.finance_entries (
  id SERIAL PRIMARY KEY,
  montant DECIMAL(10, 2) NOT NULL,
  CONSTRAINT finance_entries_montant_chk CHECK (montant > 0),
  libelle VARCHAR(500) NOT NULL,
  type_entree VARCHAR(50) NOT NULL DEFAULT 'sponsor',
  CONSTRAINT finance_entries_type_chk CHECK (
    type_entree IN ('sponsor', 'don', 'autre')
  ),
  date_entree DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by INT NOT NULL,
  CONSTRAINT finance_entries_created_by_fk FOREIGN KEY (created_by)
    REFERENCES public.users (id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_finance_entries_date ON public.finance_entries (date_entree DESC);
CREATE INDEX idx_finance_entries_type ON public.finance_entries (type_entree);
CREATE INDEX idx_finance_entries_created_by ON public.finance_entries (created_by);

CREATE TRIGGER finance_entries_updated_at
  BEFORE UPDATE ON public.finance_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- Post-installation : créer un admin avec backend/scripts/create-admin.js
-- (hash bcrypt), ou INSERT manuel après génération du hash.
--
-- Si EXECUTE FUNCTION échoue (vieux Postgres), remplacer par :
--   EXECUTE PROCEDURE public.set_updated_at();
-- =============================================================================
