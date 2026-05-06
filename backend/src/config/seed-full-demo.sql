-- =============================================================================
-- Amicale FPHM - Seed DEMO complet (test fonctionnel)
-- =============================================================================
-- Utilisation (Supabase SQL Editor):
--   1) Vérifier que le schema est déjà appliqué.
--   2) Exécuter ce script.
--
-- ATTENTION:
-- - Ce script réinitialise les données métier (TRUNCATE ... RESTART IDENTITY).
-- - A n'utiliser que sur un environnement de test / staging.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- Reset des tables principales
-- -----------------------------------------------------------------------------
TRUNCATE TABLE
  certificates,
  registrations,
  cotisations,
  activities,
  events,
  enseignants,
  partenaires,
  avantages,
  page_settings,
  users
RESTART IDENTITY CASCADE;

-- -----------------------------------------------------------------------------
-- Utilisateurs (2 admins + 6 membres)
-- Mot de passe commun (bcrypt): Test1234!
-- -----------------------------------------------------------------------------
INSERT INTO users
  (id, nom, prenom, email, password_hash, role, annee, telephone, numero_membre, is_adherent, adherent_expires_at, admin_identifier, created_by_admin_id)
VALUES
  (1, 'Admin', 'Principal', 'admin@amicale.tn', '$2a$12$.9x8fczfyuj/GZv0wNqKfeXCmuBzZCt2KXyyJCs0jiEJCFpCwUYV2', 'admin', NULL, '70000001', 'ADMIN-0001', true, NOW() + INTERVAL '2 years', 'ADM-001', NULL),
  (2, 'Admin', 'Secondaire', 'admin2@amicale.tn', '$2a$12$.9x8fczfyuj/GZv0wNqKfeXCmuBzZCt2KXyyJCs0jiEJCFpCwUYV2', 'admin', NULL, '70000002', 'ADMIN-0002', true, NOW() + INTERVAL '2 years', 'ADM-002', 1),
  (3, 'Mrad', 'Yanis', 'yanis.mrad@fphm.tn', '$2a$12$.9x8fczfyuj/GZv0wNqKfeXCmuBzZCt2KXyyJCs0jiEJCFpCwUYV2', 'member', 5, '0663868618', 'FPHM-2026-0003', true, NOW() + INTERVAL '10 months', NULL, 1),
  (4, 'Ben Ali', 'Amel', 'amel.benali@fphm.tn', '$2a$12$.9x8fczfyuj/GZv0wNqKfeXCmuBzZCt2KXyyJCs0jiEJCFpCwUYV2', 'member', 4, '21111222', 'FPHM-2026-0004', true, NOW() + INTERVAL '8 months', NULL, 1),
  (5, 'Trabelsi', 'Nour', 'nour.trabelsi@fphm.tn', '$2a$12$.9x8fczfyuj/GZv0wNqKfeXCmuBzZCt2KXyyJCs0jiEJCFpCwUYV2', 'member', 3, '23333444', 'FPHM-2026-0005', false, NULL, NULL, 2),
  (6, 'Gharbi', 'Sami', 'sami.gharbi@fphm.tn', '$2a$12$.9x8fczfyuj/GZv0wNqKfeXCmuBzZCt2KXyyJCs0jiEJCFpCwUYV2', 'member', 2, '25555666', 'FPHM-2026-0006', true, NOW() + INTERVAL '6 months', NULL, 2),
  (7, 'Kefi', 'Rym', 'rym.kefi@fphm.tn', '$2a$12$.9x8fczfyuj/GZv0wNqKfeXCmuBzZCt2KXyyJCs0jiEJCFpCwUYV2', 'member', 1, '27777888', 'FPHM-2026-0007', false, NULL, NULL, 1),
  (8, 'Sassi', 'Hichem', 'hichem.sassi@fphm.tn', '$2a$12$.9x8fczfyuj/GZv0wNqKfeXCmuBzZCt2KXyyJCs0jiEJCFpCwUYV2', 'member', 6, '29999000', 'FPHM-2026-0008', true, NOW() + INTERVAL '14 months', NULL, 2);

SELECT setval('users_id_seq', 8, true);

-- -----------------------------------------------------------------------------
-- Paramètres pages (home + a-propos + docs + tarif adhésion)
-- -----------------------------------------------------------------------------
INSERT INTO page_settings(key, value) VALUES
  ('home_banderole', 'Congrès National de Pharmacie 2026 - Inscriptions ouvertes. | Atelier IA en santé - 21 juin 2026.'),
  ('home_video_url', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
  ('home_hero_image', 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1400&q=80'),
  ('home_hero_title', 'L''amicale qui / *fédère* les / enseignants de la / Faculté de Pharmacie.'),
  ('home_hero_text', 'Association des enseignants de la FPHM: congrès, journées scientifiques, formations continues et réseau professionnel.'),
  ('home_members_count_text', '120+ Enseignants membres'),
  ('adhesion_fee_amount', '30'),
  ('enseignants_header_image', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1800&q=80'),
  ('mot_du_president', '## Mot du président\n\nBienvenue sur le portail officiel de l''Amicale FPHM.\n\nNotre objectif est de renforcer la coopération scientifique, académique et humaine entre tous les enseignants.'),
  ('presentation', '## Présentation\n\nL''Amicale des Enseignants de la Faculté de Pharmacie de Monastir accompagne les initiatives pédagogiques, scientifiques et associatives.'),
  ('historique', '## Historique\n\nFondée en **1975**, l''Amicale a accompagné plusieurs générations d''enseignants et d''étudiants.'),
  ('missions_visions', '## Missions & Visions\n\n- Développer la formation continue\n- Encourager l''innovation pédagogique\n- Renforcer les liens professionnels'),
  ('valeurs', '## Valeurs\n\nÉthique, excellence, solidarité, engagement, responsabilité.'),
  ('documents', '## Documents administratifs\n\nVous trouverez ici les statuts, documents officiels et pièces financières utiles aux membres.'),
  ('mot_du_president_image', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80'),
  ('presentation_image', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80'),
  ('historique_image', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80'),
  ('missions_visions_image', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80'),
  ('valeurs_image', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1400&q=80'),
  ('documents_image', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80'),
  ('documents_files', '[
    {"id":"doc-statuts-2026","title":"Statuts officiels 2026","url":"https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf","original_name":"statuts-2026.pdf","mime_type":"application/pdf","size":23891,"uploaded_at":"2026-05-01T10:00:00Z"},
    {"id":"doc-rib-2026","title":"RIB de l''association","url":"https://www.africau.edu/images/default/sample.pdf","original_name":"rib-association.pdf","mime_type":"application/pdf","size":30210,"uploaded_at":"2026-05-02T11:15:00Z"}
  ]')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- -----------------------------------------------------------------------------
-- Enseignants
-- -----------------------------------------------------------------------------
INSERT INTO enseignants (id, nom, titre, specialite, email, linkedin, photo_url, ordre, is_active) VALUES
  (1, 'Pr. Salma Ben Youssef', 'Professeur', 'Pharmacologie clinique', 'salma.youssef@fphm.tn', 'https://www.linkedin.com/in/salma-youssef', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80', 1, true),
  (2, 'Pr. Hatem Karray', 'Professeur agrégé', 'Chimie thérapeutique', 'hatem.karray@fphm.tn', 'https://www.linkedin.com/in/hatem-karray', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', 2, true),
  (3, 'Dr. Olfa Triki', 'Maître de conférences', 'Galénique', 'olfa.triki@fphm.tn', 'https://www.linkedin.com/in/olfa-triki', 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80', 3, true),
  (4, 'Dr. Walid Mzoughi', 'Maître assistant', 'Biophysique', 'walid.mzoughi@fphm.tn', 'https://www.linkedin.com/in/walid-mzoughi', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', 4, true),
  (5, 'Dr. Rania Jebali', 'Assistant HU', 'Biochimie', 'rania.jebali@fphm.tn', 'https://www.linkedin.com/in/rania-jebali', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80', 5, true);
SELECT setval('enseignants_id_seq', 5, true);

-- -----------------------------------------------------------------------------
-- Partenaires
-- -----------------------------------------------------------------------------
INSERT INTO partenaires (id, nom, logo_url, url, ordre, is_active) VALUES
  (1, 'Laboratoire NovaPharm', 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg', 'https://example.com/novapharm', 1, true),
  (2, 'Clinique Universitaire Monastir', 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Logo_Tunisian_Ministry_of_Health.svg', 'https://example.com/clinique', 2, true),
  (3, 'Association des Pharmaciens', 'https://upload.wikimedia.org/wikipedia/commons/7/75/Pharmacy_symbol.svg', 'https://example.com/association', 3, true),
  (4, 'BioLabs Tunisie', 'https://upload.wikimedia.org/wikipedia/commons/8/8f/OOjs_UI_icon_lab.svg', 'https://example.com/biolabs', 4, true),
  (5, 'Fondation Santé & Recherche', 'https://upload.wikimedia.org/wikipedia/commons/9/90/OOjs_UI_icon_heart.svg', 'https://example.com/fondation', 5, true);
SELECT setval('partenaires_id_seq', 5, true);

-- -----------------------------------------------------------------------------
-- Avantages adhérents
-- -----------------------------------------------------------------------------
INSERT INTO avantages (id, libelle, type_avantage, ordre, is_active) VALUES
  (1, 'Tarifs préférentiels sur les congrès partenaires', 'reduction', 1, true),
  (2, 'Accès prioritaire aux ateliers pratiques', 'avantage', 2, true),
  (3, 'Certificat officiel de participation numérique', 'avantage', 3, true),
  (4, 'Accès aux ressources pédagogiques premium', 'autre', 4, true),
  (5, 'Réseautage professionnel et mentoring', 'avantage', 5, true);
SELECT setval('avantages_id_seq', 5, true);

-- -----------------------------------------------------------------------------
-- Événements (à venir + passés + featured)
-- -----------------------------------------------------------------------------
INSERT INTO events
  (id, titre, description, long_description, date, prix, prix_adherent, image_url, gallery_images, capacite, places_restantes, lieu, categorie, is_published, featured_on_home, home_order)
VALUES
  (1, '50e anniversaire de la FPHM', 'Journée commémorative et scientifique.', 'Programme complet: tables rondes, témoignages, networking et remise d''hommages.', NOW() + INTERVAL '18 days', 300.00, 200.00, 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=80', '[]'::jsonb, 250, 210, 'Monastir', 'Social', true, true, 0),
  (2, 'Atelier IA en pharmacovigilance', 'Cas pratiques et démonstrations.', 'Atelier intensif sur l''usage de l''IA pour le suivi des effets indésirables.', NOW() + INTERVAL '10 days', 120.00, 80.00, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=80', '[]'::jsonb, 80, 46, 'Faculté de Pharmacie - Salle 2', 'Formation', true, true, 1),
  (3, 'Journée galénique appliquée', 'Formulation et contrôle qualité.', 'Focus sur la chaîne de formulation et les exigences réglementaires.', NOW() + INTERVAL '35 days', 0.00, 0.00, 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1400&q=80', '[]'::jsonb, 120, 95, 'Monastir', 'Académique', true, false, 2),
  (4, 'Hackathon Santé Digitale', 'Innovation interdisciplinaire.', 'Équipes mixtes pour prototyper des solutions de santé digitale.', NOW() + INTERVAL '52 days', 90.00, 60.00, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80', '[]'::jsonb, 100, 72, 'Monastir Tech Hub', 'Formation', true, false, 3),
  (5, 'Colloque national de pharmacologie 2024', 'Édition précédente du colloque.', 'Retour d''expérience et publication des meilleures communications.', NOW() - INTERVAL '320 days', 180.00, 120.00, 'https://images.unsplash.com/photo-1460672985063-6764ac8b9c74?auto=format&fit=crop&w=1400&q=80', '["https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1400&q=80","https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1400&q=80"]'::jsonb, 200, 0, 'Sousse', 'Académique', true, false, 4),
  (6, 'Rencontre pédagogique inter-facultés', 'Session de travail collaborative.', 'Échanges de bonnes pratiques pédagogiques entre facultés.', NOW() - INTERVAL '150 days', 0.00, 0.00, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80', '["https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=80"]'::jsonb, 90, 0, 'Tunis', 'Autre', true, false, 5);
SELECT setval('events_id_seq', 6, true);

-- -----------------------------------------------------------------------------
-- Inscriptions (membres + invité)
-- -----------------------------------------------------------------------------
INSERT INTO registrations
  (id, user_id, event_id, statut, montant_paye, methode_paiement, reference_paiement, titulaire_compte, carte_expiry, created_at)
VALUES
  (1, 3, 1, 'confirmed', 200.00, 'carte', '****9821', 'Yanis Mrad', '12/27', NOW() - INTERVAL '1 day'),
  (2, 4, 1, 'confirmed', 200.00, 'carte', '****5534', 'Amel Ben Ali', '11/27', NOW() - INTERVAL '8 hours'),
  (3, 5, 2, 'confirmed', 80.00, 'carte', '****1123', 'Nour Trabelsi', '09/28', NOW() - INTERVAL '2 hours'),
  (4, 6, 3, 'cancelled', 0.00, 'carte', '****9988', 'Sami Gharbi', '05/28', NOW() - INTERVAL '5 days');

INSERT INTO registrations
  (id, user_id, event_id, statut, montant_paye, methode_paiement, reference_paiement, guest_nom, guest_prenom, guest_email, guest_telephone, created_at)
VALUES
  (5, NULL, 2, 'confirmed', 120.00, 'carte', '****4455', 'Karoui', 'Moez', 'moez.karoui@gmail.com', '50111222', NOW() - INTERVAL '3 hours');
SELECT setval('registrations_id_seq', 5, true);

-- -----------------------------------------------------------------------------
-- Cotisations
-- -----------------------------------------------------------------------------
INSERT INTO cotisations
  (id, user_id, montant, annee_universitaire, methode_paiement, reference, statut, confirmed_by, confirmed_at, created_at)
VALUES
  (1, 3, 30.00, '2025-2026', 'carte', '****9821', 'confirmed', 1, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
  (2, 4, 30.00, '2025-2026', 'carte', '****5534', 'confirmed', 1, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
  (3, 5, 30.00, '2025-2026', 'carte', '****4455', 'rejected', 2, NOW() - INTERVAL '15 days', NOW() - INTERVAL '16 days'),
  (4, 6, 30.00, '2025-2026', 'carte', '****1234', 'confirmed', 2, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
  (5, 7, 30.00, '2025-2026', 'carte', '****8765', 'confirmed', 1, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');
SELECT setval('cotisations_id_seq', 5, true);

-- -----------------------------------------------------------------------------
-- Certificats
-- -----------------------------------------------------------------------------
INSERT INTO certificates
  (id, user_id, event_id, cotisation_id, certificate_type, title, file_name, file_url, created_at)
VALUES
  (1, 3, 1, NULL, 'event_registration', 'Certificat d''inscription - 50e anniversaire de la FPHM', 'cert-event-yanis-1.pdf', '/uploads/certificates/cert-event-yanis-1.pdf', NOW() - INTERVAL '1 day'),
  (2, 4, 1, NULL, 'event_registration', 'Certificat d''inscription - 50e anniversaire de la FPHM', 'cert-event-amel-1.pdf', '/uploads/certificates/cert-event-amel-1.pdf', NOW() - INTERVAL '8 hours'),
  (3, 3, NULL, 1, 'cotisation_confirmation', 'Certificat de cotisation 2025-2026', 'cert-cotisation-yanis-2026.pdf', '/uploads/certificates/cert-cotisation-yanis-2026.pdf', NOW() - INTERVAL '29 days'),
  (4, 4, NULL, 2, 'cotisation_confirmation', 'Certificat de cotisation 2025-2026', 'cert-cotisation-amel-2026.pdf', '/uploads/certificates/cert-cotisation-amel-2026.pdf', NOW() - INTERVAL '19 days'),
  (5, 6, NULL, 4, 'cotisation_confirmation', 'Certificat de cotisation 2025-2026', 'cert-cotisation-sami-2026.pdf', '/uploads/certificates/cert-cotisation-sami-2026.pdf', NOW() - INTERVAL '9 days');
SELECT setval('certificates_id_seq', 5, true);

-- -----------------------------------------------------------------------------
-- Activités / actualités
-- -----------------------------------------------------------------------------
INSERT INTO activities
  (id, title, summary, content, category, main_image, gallery_images, author_id, is_published, published_at, created_at)
VALUES
  (1, 'Lancement du programme mentorat', 'Mise en relation enseignants seniors et jeunes enseignants.', 'Programme annuel de mentorat axé sur l''accompagnement pédagogique et scientifique.', 'projet', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80', '[]'::jsonb, 1, true, NOW() - INTERVAL '40 days', NOW() - INTERVAL '41 days'),
  (2, 'Vie associative: journée sportive', 'Renforcer la cohésion de l''amicale.', 'Organisation d''une journée sportive et conviviale pour les membres.', 'vie_etudiante', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1400&q=80', '[]'::jsonb, 2, true, NOW() - INTERVAL '18 days', NOW() - INTERVAL '19 days'),
  (3, 'Flash info: nouveau calendrier', 'Mise à jour du planning semestriel.', 'Le nouveau calendrier des formations et événements est disponible.', 'flash_info', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80', '[]'::jsonb, 1, true, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
  (4, 'Événement international à Monastir', 'Partenariat avec des experts internationaux.', 'Retour sur la rencontre internationale en pharmacie clinique.', 'evenement', 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?auto=format&fit=crop&w=1400&q=80', '[]'::jsonb, 2, true, NOW() - INTERVAL '90 days', NOW() - INTERVAL '92 days'),
  (5, 'Partenariat industrie-université', 'Signature d''une nouvelle convention.', 'Convention de coopération pour stages, recherche et transfert technologique.', 'partenariat', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80', '[]'::jsonb, 1, true, NOW() - INTERVAL '12 days', NOW() - INTERVAL '13 days');
SELECT setval('activities_id_seq', 5, true);

-- -----------------------------------------------------------------------------
-- Données optionnelles si tables présentes (finance, audit)
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.finance_entries') IS NOT NULL THEN
    INSERT INTO finance_entries (montant, libelle, type_entree, date_entree, created_by)
    VALUES
      (12000.00, 'Sponsoring congrès annuel', 'sponsor', CURRENT_DATE - INTERVAL '40 days', 1),
      (3500.00, 'Don exceptionnel ancien membre', 'don', CURRENT_DATE - INTERVAL '22 days', 1),
      (1800.00, 'Soutien logistique partenaire', 'autre', CURRENT_DATE - INTERVAL '8 days', 2);
  END IF;

  IF to_regclass('public.audit_log') IS NOT NULL THEN
    INSERT INTO audit_log (user_id, user_email, admin_identifier, action, method, path, resource_type, resource_id, details, ip_address, created_at)
    VALUES
      (1, 'admin@amicale.tn', 'ADM-001', 'create_event', 'POST', '/api/events', 'event', '1', '{"titre":"50e anniversaire de la FPHM"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '18 days'),
      (2, 'admin2@amicale.tn', 'ADM-002', 'update_setting', 'PUT', '/api/admin/settings/home_banderole', 'setting', 'home_banderole', '{"value":"updated"}'::jsonb, '127.0.0.1', NOW() - INTERVAL '2 days');
  END IF;
END $$;

COMMIT;

-- =============================================================================
-- Comptes de test (mot de passe commun): Test1234!
-- - admin@amicale.tn / admin2@amicale.tn
-- - yanis.mrad@fphm.tn, amel.benali@fphm.tn, etc.
-- =============================================================================
