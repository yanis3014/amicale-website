// Mock data pour les activités de l'Amicale des ENSEIGNANTS

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
    title: 'Congrès National des Enseignants en Pharmacie 2026',
    summary: 'Le congrès annuel de l\'Amicale réunira les enseignants en pharmacie de toute la Tunisie pour des conférences, ateliers et échanges professionnels.',
    content: `Le **Congrès National des Enseignants en Pharmacie** est l'événement phare de l'Amicale. L'édition 2026 se tiendra à Monastir.

**Au programme**

**Conférences plénières**
Des experts nationaux et internationaux interviendront sur les enjeux actuels de l'enseignement pharmaceutique et de la recherche.

**Ateliers thématiques**
- Innovations pédagogiques
- Recherche et publication
- Relations avec la profession
- Formation continue

**Assemblée générale de l'Amicale**
Bilan de l'année, orientations et renouvellement des instances.

**Moments de convivialité**
Dîner de gala et networking pour renforcer les liens entre enseignants des différentes facultés.

Inscription réservée aux membres de l'Amicale.`,
    category: 'evenement',
    main_image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800',
    gallery_images: [],
    published_at: '2026-02-10T10:00:00Z',
    created_at: '2026-02-08T14:30:00Z',
  },
  {
    id: '2',
    title: 'Journée Scientifique de la Faculté 2026',
    summary: 'La journée scientifique annuelle permet aux enseignants de présenter leurs travaux de recherche et de partager leurs avancées avec la communauté.',
    content: `La **Journée Scientifique** est organisée chaque année par l'Amicale en collaboration avec la direction de la faculté.

**Objectifs**

- Valoriser les travaux de recherche des enseignants
- Favoriser les échanges entre départements
- Présenter les projets en cours et les publications
- Renforcer la dynamique scientifique de la FPHM

**Format**

- Communications orales et posters
- Sessions par thématique (sciences du médicament, clinique, santé publique…)
- Prix du meilleur poster et de la meilleure communication
- Table ronde sur les financements et partenariats

**Public**

Enseignants, chercheurs et doctorants de la faculté. Ouvert aux membres de l'Amicale et sur invitation.`,
    category: 'evenement',
    main_image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    gallery_images: [],
    published_at: '2026-02-08T09:00:00Z',
    created_at: '2026-02-05T16:00:00Z',
  },
  {
    id: '3',
    title: 'Voyage d\'étude — Congrès international à Paris',
    summary: 'L\'Amicale organise un déplacement groupé pour le congrès international de pharmacie à Paris. Inscriptions ouvertes aux membres.',
    content: `L'Amicale propose un **voyage d'étude** à l'occasion du congrès international de pharmacie qui se tiendra à Paris en juin 2026.

**Au programme**

- Participation au congrès (sessions au choix)
- Visites de sites pharmaceutiques et laboratoires
- Découverte de partenaires académiques français
- Hébergement et déplacements groupés

**Conditions**

- Réservé aux enseignants membres de l'Amicale à jour de cotisation
- Nombre de places limité
- Prise en charge partielle par l'Amicale sous conditions

**Inscriptions**

Les pré-inscriptions sont ouvertes. Contactez le bureau de l'Amicale pour tout renseignement.`,
    category: 'projet',
    main_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    gallery_images: [],
    published_at: '2026-02-05T12:00:00Z',
    created_at: '2026-02-03T10:00:00Z',
  },
  {
    id: '4',
    title: 'Publication du bulletin trimestriel de l\'Amicale',
    summary: 'Le numéro de mars 2026 du bulletin de l\'Amicale est paru : actualités, comptes rendus et agenda des prochains événements.',
    content: `Le **bulletin trimestriel** de l'Amicale des Enseignants de la FPHM est disponible.

**Dans ce numéro**

- Compte rendu du dernier bureau et de l'assemblée générale
- Retour sur la Journée Scientifique 2025
- Agenda : Congrès national, formation continue, voyage d'étude
- Portrait d'un enseignant membre
- Actualités réglementaires et appels à projets
- Rubrique partenariats (Ordre des Pharmaciens, industrie)

**Diffusion**

Le bulletin est envoyé par email à tous les membres. Une version papier est disponible au bureau de l'Amicale.

Pour contribuer au prochain numéro (articles, suggestions), contactez le secrétariat.`,
    category: 'flash_info',
    main_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
    gallery_images: [],
    published_at: '2026-01-28T14:00:00Z',
    created_at: '2026-01-25T11:00:00Z',
  },
  {
    id: '5',
    title: 'Partenariat avec l\'Ordre des Pharmaciens de Tunisie',
    summary: 'Signature d\'une convention cadre entre l\'Amicale et l\'Ordre des Pharmaciens pour des actions communes en formation continue et rayonnement.',
    content: `L'Amicale et l'**Ordre des Pharmaciens de Tunisie** ont signé une convention cadre de partenariat.

**Axes de collaboration**

- **Formation continue** : co-organisation de sessions à destination des enseignants et des pharmaciens
- **Événements** : participation croisée aux congrès et journées thématiques
- **Publications** : diffusion mutuelle d'informations et d'actualités
- **Projets** : soutien à des initiatives communes (études, enquêtes, bonnes pratiques)

**Bénéfices pour les membres**

- Accès à des formations labellisées Ordre / Amicale
- Réductions sur les événements organisés par l'Ordre
- Meilleure visibilité des travaux des enseignants auprès de la profession

La convention a été signée en présence du Doyen et du Président de l'Ordre.`,
    category: 'partenariat',
    main_image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
    gallery_images: [],
    published_at: '2026-01-20T08:00:00Z',
    created_at: '2026-01-18T13:00:00Z',
  },
  {
    id: '6',
    title: 'Vie de l\'Amicale — Activités du trimestre',
    summary: 'Récapitulatif des activités et des temps forts de l\'Amicale : bureau, commissions, prochains rendez-vous.',
    content: `**Vie de l'Amicale** — Point sur les activités du trimestre.

**Bureau et commissions**

- Réunion du bureau : orientations 2025-2026
- Commission Événements : préparation du Congrès national
- Commission Formation : programme de formation continue
- Commission Partenariats : suivi des conventions

**Prochains rendez-vous**

- Assemblée générale ordinaire (date à confirmer)
- Journée Scientifique 2026
- Voyage d'étude Paris (pré-inscriptions ouvertes)

**Cotisations**

Les cotisations 2025-2026 sont à jour pour la majorité des membres. Merci aux adhérents. Pour régulariser votre situation, contactez le trésorier.`,
    category: 'vie_etudiante',
    main_image: 'https://images.unsplash.com/photo-1615461066159-fea0960485d5?w=800&q=80',
    gallery_images: [],
    published_at: '2026-01-15T10:00:00Z',
    created_at: '2026-01-12T15:00:00Z',
  },
];
