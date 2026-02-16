// Mock data pour les activités et actualités

export type ActivityCategory = 'projet' | 'vie_etudiante' | 'flash_info' | 'evenement' | 'partenariat';

export interface Activity {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: ActivityCategory;
  main_image: string | null;
  gallery_images: string[];
  published_at: string;
  created_at: string;
}

export const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Journée Portes Ouvertes 2026 : Un Franc Succès',
    summary: 'Plus de 500 lycéens ont découvert notre faculté lors de la journée portes ouvertes annuelle organisée par l\'Amicale.',
    content: `La journée portes ouvertes 2026 a connu un succès retentissant avec la participation de plus de 500 lycéens venus découvrir les filières de pharmacie.

Au programme de cette journée exceptionnelle :

**Visites guidées des laboratoires**
Les étudiants ambassadeurs ont fait découvrir les laboratoires de recherche, les salles de travaux pratiques et les espaces d'études modernes de la faculté.

**Conférences thématiques**
Plusieurs professeurs ont animé des conférences sur les métiers de la pharmacie, les débouchés professionnels et les innovations dans le domaine pharmaceutique.

**Stands d'information**
L'Amicale a tenu plusieurs stands pour présenter ses activités, ses projets et répondre aux questions des futurs étudiants.

**Témoignages étudiants**
Des anciens et des étudiants actuels ont partagé leur expérience et leur parcours, créant ainsi un moment d'échange privilégié.

Cette journée s'inscrit dans notre mission de rayonnement et de communication autour des études pharmaceutiques.`,
    category: 'evenement',
    main_image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery_images: [],
    published_at: '2026-02-10T10:00:00Z',
    created_at: '2026-02-08T14:30:00Z',
  },
  {
    id: '2',
    title: 'Lancement du Projet Tutorat Pharmaceutique',
    summary: 'L\'Amicale lance un programme de tutorat gratuit pour accompagner les étudiants de première année dans leur réussite académique.',
    content: `Face aux défis académiques rencontrés par les étudiants de première année, l'Amicale de la Faculté de Pharmacie a décidé de mettre en place un **programme de tutorat pharmaceutique** complet et gratuit.

**Objectifs du programme**

- Accompagner les nouveaux étudiants dans leur transition lycée-université
- Offrir un soutien académique personnalisé dans les matières fondamentales
- Créer du lien entre les différentes promotions
- Améliorer le taux de réussite en première année

**Organisation des séances**

Les séances de tutorat auront lieu trois fois par semaine :
- Lundi : Chimie générale et organique
- Mercredi : Mathématiques et physique
- Vendredi : Biologie cellulaire et biochimie

Chaque séance dure 2 heures et accueille des groupes de 10 à 15 étudiants maximum pour garantir un suivi personnalisé.

**Équipe de tuteurs**

20 étudiants de 3ème et 4ème année, sélectionnés pour leurs excellents résultats académiques et leurs qualités pédagogiques, encadreront le programme.

**Inscription**

Les inscriptions sont ouvertes dès maintenant via le formulaire en ligne sur notre plateforme. Les places sont limitées !`,
    category: 'projet',
    main_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    gallery_images: [],
    published_at: '2026-02-08T09:00:00Z',
    created_at: '2026-02-05T16:00:00Z',
  },
  {
    id: '3',
    title: 'Soirée Gala 2026 : Les Inscriptions Sont Ouvertes',
    summary: 'Ne manquez pas l\'événement phare de l\'année ! Le Gala Annuel se tiendra le 15 mars à l\'Hôtel des Lumières. Réservez vos places dès maintenant.',
    content: `L'Amicale a le plaisir de vous annoncer l'ouverture des inscriptions pour le **Gala Annuel 2026**, l'événement le plus attendu de l'année universitaire !

**Informations pratiques**

📅 **Date** : Samedi 15 mars 2026
🕐 **Heure** : 19h00 - 02h00
📍 **Lieu** : Hôtel des Lumières, Monastir
💰 **Tarif** : 25 DT (repas et animations inclus)

**Au programme**

- **19h00** : Cocktail de bienvenue
- **20h00** : Dîner gastronomique 4 services
- **21h30** : Cérémonie de remise des prix d'excellence académique
- **22h00** : Ouverture de la piste de danse avec DJ professionnel
- **Minuit** : Surprises et animations spéciales

**Dress code**

Tenue de soirée élégante exigée. Messieurs : costume / smoking. Dames : robe de soirée.

**Réservations**

⚠️ **Places limitées** : Seulement 200 places disponibles
🎟️ **Billets** : En vente dès maintenant sur notre plateforme
💳 **Paiement** : En ligne (Flouci) ou en espèces au bureau de l'Amicale

N'attendez pas pour réserver vos places ! L'événement de l'année dernière affichait complet en moins d'une semaine.`,
    category: 'flash_info',
    main_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    gallery_images: [],
    published_at: '2026-02-05T12:00:00Z',
    created_at: '2026-02-03T10:00:00Z',
  },
  {
    id: '4',
    title: 'Partenariat Stratégique avec le Groupe Pharmaceutique PharmaTech',
    summary: 'L\'Amicale signe un accord de partenariat majeur avec PharmaTech pour des stages, formations et opportunités d\'emploi.',
    content: `C'est avec une grande fierté que l'Amicale de la Faculté de Pharmacie annonce la signature d'un **partenariat stratégique** avec le Groupe PharmaTech, leader tunisien dans la distribution pharmaceutique.

**Axes du partenariat**

**1. Programme de stages professionnels**
- 30 places de stages garanties chaque année
- Stages en officine, industrie et distribution
- Durée : 2 à 6 mois selon les besoins

**2. Formations spécialisées**
- Ateliers sur les bonnes pratiques pharmaceutiques
- Formation aux nouveaux outils digitaux de pharmacie
- Conférences animées par des professionnels du secteur

**3. Opportunités d'emploi**
- Recrutement prioritaire de nos diplômés
- Programme de jeunes talents PharmaTech
- CDI et CDD proposés

**4. Soutien financier**
- Bourses d'excellence académique
- Financement de projets étudiants innovants
- Sponsoring d'événements de l'Amicale

**Cérémonie de signature**

La signature officielle a eu lieu en présence du Doyen de la Faculté, du Président de l'Amicale et du Directeur Général de PharmaTech.

Ce partenariat représente une avancée majeure pour l'insertion professionnelle de nos étudiants et la reconnaissance de la qualité de notre formation.`,
    category: 'partenariat',
    main_image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    gallery_images: [],
    published_at: '2026-01-28T14:00:00Z',
    created_at: '2026-01-25T11:00:00Z',
  },
  {
    id: '5',
    title: 'Campagne de Collecte de Sang : Mobilisation Générale',
    summary: 'L\'Amicale organise une grande campagne de don de sang en partenariat avec le Centre National de Transfusion Sanguine.',
    content: `Dans le cadre de sa mission citoyenne et solidaire, l'Amicale organise une **campagne de collecte de sang** en partenariat avec le Centre National de Transfusion Sanguine (CNTS).

**Pourquoi donner son sang ?**

Le don de sang est un geste citoyen qui sauve des vies. Chaque don peut sauver jusqu'à 3 personnes. En tant qu'étudiants en sciences de la santé, nous avons un rôle d'exemple à jouer.

**Informations pratiques**

📅 **Dates** : Mardi 2 et Mercredi 3 mars 2026
🕐 **Horaires** : 9h00 - 16h00
📍 **Lieu** : Hall principal de la Faculté
🎯 **Objectif** : 150 dons

**Qui peut donner ?**

- Âge : 18-65 ans
- Poids minimum : 50 kg
- En bonne santé
- À jeun depuis au moins 4 heures

**Avantages pour le donneur**

✅ Bilan sanguin gratuit complet
✅ Attestation de don
✅ Collation offerte
✅ Badge "Donneur de l'Amicale"

**Inscription préalable recommandée**

Pour éviter l'attente, inscrivez-vous en ligne via notre formulaire. Les places sans rendez-vous restent possibles dans la limite des disponibilités.

**Points bonus pour les membres de l'Amicale**

Chaque don effectué vous rapporte 50 points de fidélité sur votre carte membre !

Ensemble, mobilisons-nous pour cette cause noble ! 💉❤️`,
    category: 'vie_etudiante',
    main_image: 'https://images.unsplash.com/photo-1615461066159-fea0960485d5?w=800&q=80',
    gallery_images: [],
    published_at: '2026-01-20T08:00:00Z',
    created_at: '2026-01-18T13:00:00Z',
  },
  {
    id: '6',
    title: 'Atelier CV et Entretiens : Préparez Votre Avenir Professionnel',
    summary: 'Un atelier pratique pour apprendre à rédiger un CV percutant et réussir vos entretiens d\'embauche.',
    content: `L'Amicale organise un **atelier pratique CV et Entretiens** pour vous aider à préparer efficacement votre insertion professionnelle.

**Programme de l'atelier**

**Partie 1 : Rédiger un CV qui se démarque (2h)**
- Structure d'un CV pharmaceutique efficace
- Mise en valeur des compétences techniques
- Erreurs courantes à éviter
- Analyse de CV réussis

**Partie 2 : Maîtriser l'entretien d'embauche (2h)**
- Préparer ses réponses aux questions classiques
- Techniques de communication verbale et non-verbale
- Simulations d'entretiens en conditions réelles
- Retours personnalisés par les formateurs

**Intervenants**

- **Mr. Karim Dhouib**, RH Manager chez PharmaMed
- **Mme Sonia Gharbi**, Directrice Recrutement GipharmeTech
- **Pr. Youssef Trabelsi**, Responsable Relations Entreprises

**Informations pratiques**

📅 **Date** : Samedi 12 février 2026
🕐 **Horaires** : 9h00 - 13h00
📍 **Lieu** : Amphithéâtre A
💰 **Tarif** : GRATUIT pour les membres de l'Amicale
👥 **Places** : 60 participants maximum

**Bonus**

Chaque participant repartira avec :
- Un guide PDF "Réussir son entretien pharmaceutique"
- Une checklist CV personnalisée
- Un template CV professionnel modifiable

**Inscription obligatoire**

Inscrivez-vous dès maintenant via le formulaire en ligne. Les places étant limitées, ne tardez pas !`,
    category: 'vie_etudiante',
    main_image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    gallery_images: [],
    published_at: '2026-01-15T10:00:00Z',
    created_at: '2026-01-12T15:00:00Z',
  },
];
