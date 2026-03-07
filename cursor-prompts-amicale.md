# 🎯 Cursor Prompts — Refonte Amicale FPHM (VPS + API REST + Design System)

> **Ordre d'exécution** : Suis les prompts dans l'ordre numéroté. Chaque prompt est autonome mais dépend du précédent.
> **Phase 0 à exécuter EN PREMIER** — Elle pose le design system que toutes les autres phases utilisent.

---

## 📋 CONTEXTE GLOBAL (à coller en début de chaque session Cursor si besoin)

```
Ce projet est le site de l'Amicale de la Faculté de Pharmacie de Monastir (Next.js 14 App Router + Tailwind CSS).
On migre de Supabase vers un backend sur VPS (Node.js + Express + PostgreSQL).
Stack finale : Next.js (frontend) | Express.js (API REST) | PostgreSQL (BDD) | JWT (auth).
La couleur primaire est maintenant le VERT (brand-green), plus de bleu comme couleur principale.
Le design suit le système défini dans tailwind.config.ts et les tokens CSS de globals.css.
```

---

## PHASE 0 — DESIGN SYSTEM (À FAIRE EN TOUT PREMIER)

---

### PROMPT 0.1 — Nouveau Tailwind Config + Tokens Design

```
Refonds entièrement le design system du projet. La couleur primaire devient le VERT (on retire le bleu comme couleur dominante).

Met à jour tailwind.config.ts avec cette palette complète :

colors: {
  primary: {
    50:  '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',   // couleur principale
    600: '#16a34a',   // hover states
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },
  forest: {
    50:  '#f0fdf4',
    100: '#d1fae5',
    500: '#059669',
    600: '#047857',
    700: '#065f46',
    800: '#064e3b',
    900: '#022c22',
  },
  neutral: {
    0:   '#ffffff',
    50:  '#f8faf9',
    100: '#f1f5f2',
    200: '#e5ebe6',
    300: '#d0d9d2',
    400: '#9aab9d',
    500: '#6b7c6e',
    600: '#4a5c4d',
    700: '#374039',
    800: '#232b24',
    900: '#141a15',
  },
  gold: {
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
  },
  success: '#22c55e',
  warning: '#f59e0b',
  danger:  '#ef4444',
  info:    '#3b82f6',
},

boxShadow: {
  'card':    '0 2px 8px 0 rgba(20, 83, 45, 0.08)',
  'card-lg': '0 8px 32px 0 rgba(20, 83, 45, 0.12)',
  'glow':    '0 0 24px 0 rgba(34, 197, 94, 0.25)',
  'inner-sm':'inset 0 1px 3px 0 rgba(20, 83, 45, 0.06)',
},

borderRadius: {
  'xl':  '12px',
  '2xl': '16px',
  '3xl': '24px',
  '4xl': '32px',
},

fontFamily: {
  display: ['Bricolage Grotesque', 'sans-serif'],
  body:    ['Instrument Sans', 'sans-serif'],
  mono:    ['JetBrains Mono', 'monospace'],
},

Dans /src/app/globals.css, remplace le contenu par :

@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #22c55e;
  --primary-dark: #16a34a;
  --primary-light: #dcfce7;
  --forest: #065f46;
  --bg: #f8faf9;
  --surface: #ffffff;
  --border: #e5ebe6;
  --text-primary: #141a15;
  --text-secondary: #4a5c4d;
  --text-muted: #9aab9d;
}

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: #86efac; border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: var(--primary); }

::selection { background: #dcfce7; color: #065f46; }

html { scroll-behavior: smooth; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.3); }
  50%       { box-shadow: 0 0 0 12px rgba(34, 197, 94, 0); }
}

.animate-fade-up { animation: fadeUp 0.5s ease both; }
.skeleton-shimmer {
  background: linear-gradient(90deg, #f1f5f2 25%, #e5ebe6 50%, #f1f5f2 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

Dans tout le projet, remplace :
- `brand-blue`     → `primary`
- `brand-blue-600` → `primary-600`
- `brand-blue-50`  → `primary-50`
- `bg-neutral-bg`  → `bg-neutral-50`
- `text-brand-blue`→ `text-primary-600`
- `brand-green`    → `primary` (même couleur désormais)
```

---

### PROMPT 0.2 — Composants UI réutilisables (Design System)

```
Crée le design system de composants dans /src/components/ui/.

--- Button.tsx ---
Variants : primary | secondary | outline | ghost | danger
Sizes    : sm | md | lg | xl
Props    : loading (boolean), leftIcon, rightIcon, disabled

Styles par variant :
- primary  : bg-primary-500 text-white hover:bg-primary-600, shadow-sm hover:shadow-glow, transition-all duration-200
- secondary: bg-neutral-100 text-neutral-800 hover:bg-neutral-200
- outline  : border-2 border-primary-500 text-primary-600 hover:bg-primary-50
- ghost    : text-primary-600 hover:bg-primary-50
- danger   : bg-red-500 text-white hover:bg-red-600
- Tous : rounded-xl font-body font-semibold
- Loading : spinner Loader2 animé, cursor-not-allowed

--- Badge.tsx ---
Props : variant (success|warning|danger|info|neutral|primary|purple|orange|teal|gold), size (sm|md)
Style : rounded-full, font-semibold, padding compact

--- Card.tsx ---
Variants : default | elevated | bordered | glass
- default  : bg-white rounded-2xl shadow-card border border-neutral-100
- elevated : bg-white rounded-2xl shadow-card-lg
- bordered : border-2 border-neutral-200 rounded-2xl
- glass    : bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-card
hover prop : hover:-translate-y-1 hover:shadow-card-lg transition-all duration-300

--- Input.tsx ---
Props : label, error, hint, leftIcon, rightIcon, size
- Focus  : border-primary-500 ring-2 ring-primary-100
- Error  : border-red-400 ring-2 ring-red-100
- Style  : rounded-xl border-2 border-neutral-200 bg-white font-body
- Label  : text-sm font-semibold text-neutral-700 mb-1.5
- Hint   : text-xs text-neutral-500 mt-1
- Error  : text-xs text-red-500 mt-1

--- Select.tsx ---
Même style que Input, chevron custom (pas le select natif).

--- Modal.tsx ---
Props : isOpen, onClose, title, size (sm|md|lg|xl), children
- Overlay : bg-black/40 backdrop-blur-sm
- Panel   : bg-white rounded-3xl shadow-card-lg p-8
- Entrée  : scale(0.95)→scale(1) + opacity 0→1, 200ms
- Fermeture Escape key (useEffect)
- X bouton haut-droite

--- Skeleton.tsx ---
SkeletonText, SkeletonCard, SkeletonImage
Style : rounded-lg skeleton-shimmer

--- Toast.tsx ---
Système de notifications sans librairie externe.
ToastContext + useToast() hook.
Position : top-right
Variants : success | error | warning | info
Auto-dismiss 4s, animation slide-in/out
Icônes lucide-react selon variant
Ajouter <ToastProvider> dans layout.tsx

--- EmptyState.tsx ---
Props : icon, title, description, action (label + onClick)
Style : centré, icône bg-neutral-100, textes neutres

--- ConfirmModal.tsx ---
Props : isOpen, onClose, onConfirm, title, message, confirmLabel, dangerMode
Pour remplacer tous les window.confirm() dans le projet.

--- LoadingSpinner.tsx ---
Spinner propre. Variants : sm(16px) | md(32px) | lg(64px). Couleur primary-500.
```

---

### PROMPT 0.3 — Nouveau Header (design premium)

```
Refonds entièrement /src/components/shared/Header.tsx.

Structure :
- Logo gauche : icône croix pharma SVG verte + "Amicale" (primary-600, font-display, bold) + "FPHM" (neutral-400, regular)
- Navigation centre : font-body font-medium text-neutral-600
  Hover : text-primary-600 + underline animée (transform scaleX 0→1 depuis la gauche, primary-500, 1.5px)
  Lien actif (usePathname) : text-primary-600 + pastille verte 3px dessous (absolute, rounded-full)
- Droite :
  * Si non connecté : bouton "Espace Membre" (variant outline)
  * Si connecté : avatar rond (initiales sur fond primary-100, texte primary-700)
    Dropdown : "Mon espace" | "Administration" (si admin) | séparateur | "Déconnexion"
    Dropdown : bg-white shadow-card-lg rounded-2xl p-2, animé (opacity + translateY)

Comportement scroll :
- Top (y=0) : bg-white/80 backdrop-blur-md border-b border-transparent
- Après 20px : bg-white border-b border-neutral-100 shadow-sm
  Transition fluide (transition-all duration-300)

Mobile :
- Hamburger, menu en slide-down (animation height 0→auto)
- Fond blanc avec légère ombre en bas

Importer le composant Button du design system.
```

---

### PROMPT 0.4 — Nouveau Footer (design éditorial)

```
Refonds /src/components/shared/Footer.tsx.

Design : Fond forest-900 (#022c22) — vert très sombre, premium.

Layout 4 colonnes desktop, 2 tablette, 1 mobile.

Colonne 1 — Brand :
- Logo blanc
- Tagline : "Façonner les pharmaciens de demain" en italic text-primary-300
- Réseaux sociaux : icônes rondes bg-white/10 hover:bg-primary-500/30 transition

Colonnes 2-3 — Navigation et Ressources :
- Titres de section : uppercase text-xs text-primary-400 font-semibold tracking-wider
- Liens : text-neutral-300 hover:text-primary-300, arrow → au hover

Colonne 4 — Contact :
- Adresse, email cliquable, téléphone, horaires bureau

Séparateur :
- border-white/10
- Copyright + Mentions légales | Confidentialité

Détails visuels :
- Ligne dégradé primary-500→transparent de 1px en haut du footer
- Pattern SVG en opacity-5 sur le fond (points ou croix pharma subtils)
```

---

### PROMPT 0.5 — Nouvelle Homepage (impact maximal)

```
Refonds entièrement /src/app/page.tsx et tous ses composants enfants.

--- HERO (/src/components/home/HeroSection.tsx) ---

Layout split 55/45 sur desktop.

Gauche :
- Badge animé : fond primary-100 text-primary-700 rounded-full, petite icône pulsante (animate-ping)
  Texte : "Année universitaire 2025-2026"
- H1 en font-display text-5xl md:text-7xl font-extrabold line-height-tight
  "L'Amicale qui propulse les futurs pharmaciens"
  Mot "propulse" en primary-500 + soulignement SVG ondulé en position absolute dessous
- Sous-titre text-lg text-neutral-500 max-w-md font-body
- 2 CTAs :
  * "Rejoindre l'Amicale" (Button primary xl) + ArrowRight icon
  * "Voir les événements" (Button ghost xl) + Play icon
- Stats row (3 items séparés par | fines) :
  "500+ Membres" | "50+ Événements" | "10 ans d'excellence"
  Chiffres : font-display primary-600 font-bold

Droite :
- Container rounded-3xl overflow-hidden shadow-card-lg
- Image /images/hero2.jpeg objecte-cover
- Floating card glassmorphism en bas-gauche (absolute) :
  bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-card
  "🎓 Prochain événement" + nom + date (données réelles si dispo, sinon placeholder)

Animations CSS (pas de librairie) — au chargement :
- Badge    : animate-fade-up, delay 0ms
- Titre    : animate-fade-up, delay 150ms
- Sous-titre : animate-fade-up, delay 300ms
- CTAs     : animate-fade-up, delay 450ms
- Stats    : animate-fade-up, delay 600ms
- Image    : animate-fade-up, delay 200ms + scale 0.98→1

--- PULSE BAR ---

Fond primary-500 (vert). Icône 📢 animate-ping avant le texte. Marquee.

--- EVENTS SECTION (/src/components/home/EventsSection.tsx) ---

- Fond bg-neutral-50
- Titre avec border-l-4 border-primary-500 pl-4
- Cards : Card variant="elevated" hover, zoom image group-hover:scale-105
  Badge catégorie (Badge component) + badge prix (fond blanc, font-mono)
  Barre places (verte/orange/rouge)
  Bouton "S'inscrire" w-full variant primary en bas

--- VIDEO SECTION ---
- Container rounded-3xl
- Bouton play : ring-4 ring-white/30 + animation pulse-glow
- Overlay gradient progressif (pas flat)

--- PARTNERS ---
- Logos niveaux de gris → couleur au hover
- Titre uppercase tracking-wide text-muted
```

---

### PROMPT 0.6 — Refonte page Events

```
Refonds /src/app/events/page.tsx et /src/app/events/[id]/page.tsx.

--- LISTE ---

Header :
- Fond blanc, titre "Nos Événements" font-display text-5xl font-bold
- Illustration SVG décorative : cercles concentriques primary-100 en absolute, opacity-30, overflow hidden

Filtres sticky :
- bg-white/95 backdrop-blur-sm border-b border-neutral-100
- Pills filtres : actif = bg-primary-500 text-white, inactif = bg-neutral-100 text-neutral-600
- Input utilise le composant Input du design system

Featured event (premier de la liste, séparé) :
- Card horizontale 2 cols (image 40% | contenu 60%)
- Badge "⭐ À la une" primary-500
- Badge catégorie + date + titre xl + description + barre places + CTA

Grille events : 3/2/1 cols. SkeletonCard loading. EmptyState si vide.

--- DÉTAIL [id] ---

Hero :
- Image 50vh, overlay gradient transparent→black/60
- Breadcrumb + titre font-display blanc font-bold text-4xl
- Bouton retour : bg-white/20 backdrop-blur rounded-xl text-white

Layout 2 colonnes (2/3 + 1/3) :
- Gauche : infos pratiques (Card elevated, icônes colorées) + description (prose stylisée)
- Droite sticky : Card "Inscription"
  * Gros prix en primary-600 font-display
  * ~~prix normal~~ prix adhérent (ligne barrée) si is_adherent + badge "Tarif membre" gold
  * Barre places dynamique
  * CTA Button primary xl w-full + pulse-glow si places < 10
  * "Bon à savoir" Card bordered
```

---

### PROMPT 0.7 — Refonte page Activities

```
Refonds /src/app/activites/page.tsx et /src/app/activites/[id]/page.tsx.

--- LISTE ---

5 boutons catégories avec couleurs distinctes :
- Projet → purple-500
- Vie étudiante → primary-500
- Flash Info → orange-500
- Événement → teal-500
- Partenariat → gold-500

Featured : Card horizontale, badge catégorie coloré, titre font-display text-3xl.

Cards grille : bande colorée de 3px en haut (couleur de la catégorie).

--- DÉTAIL [id] ---

Hero : image 55vh pleine largeur, overlay gradient.

Corps max-w-3xl centré :
- Lead paragraph : text-xl text-neutral-600 font-medium italic
- react-markdown avec styles prose soignés :
  * h2 : font-display text-2xl text-forest-800, border-b border-primary-200, pb-2, mt-10 mb-4
  * h3 : font-display text-xl text-forest-700, mt-8 mb-3
  * p  : text-neutral-700 leading-relaxed mb-5 font-body
  * ul : list-disc text-neutral-700 space-y-2 pl-6
  * strong : text-forest-800 font-semibold
  * blockquote : border-l-4 border-primary-400, pl-6, italic, text-neutral-500

Galerie : grid 3 cols, aspect-square rounded-2xl.
Lightbox au clic : Modal fullscreen bg-black/90, image centrée, nav prev/next.

Navigation précédent/suivant : Cards primary-50, hover border-primary-500.
```

---

### PROMPT 0.8 — Refonte page Enseignants

```
Refonds /src/app/enseignants/page.tsx.

Hero :
- Overlay dégradé diagonal forest-900/70 → primary-800/40 (pas le noir flat actuel)
- Titre font-display text-5xl md:text-7xl font-black text-white
- Sous-titre italic text-primary-200

Grille 4/2/1 cols :
- Card bg-white rounded-2xl shadow-card hover:shadow-card-lg
- Photo aspect-square object-cover object-top rounded-t-2xl
  Pas de photo → dégradé primary-100→primary-200 + initiales font-display text-3xl text-primary-600
- Bande 4px dégradé primary-400→primary-600 en bas de la photo
- Contenu p-4 : nom font-display bold, rôle text-primary-600 text-sm font-semibold
- Bouton email ghost discret en bas

CTA section :
- Dégradé diagonal primary-600 → forest-700
- Titre blanc, sous-titre text-primary-200
- Bouton bg-white text-primary-700 font-bold
- Cercles décoratifs bg-white/5 en absolute
```

---

### PROMPT 0.9 — Refonte Dashboard Membre

```
Refonds /src/app/dashboard/page.tsx.

Header :
- Dégradé primary-600 → forest-700
- Avatar initiales bg-white/20
- Si adhérent → badge "⭐ Adhérent 2025-2026" bg-gold-500 text-white rounded-full
- Si non adhérent → bannière gold-500/20 text-gold-700 : "Devenez adhérent pour débloquer tous les avantages →" + bouton

Tabs : ligne animée sous le tab actif (transition transform translateX).

Carte membre virtuelle :
- Dégradé primary-700 → forest-800
- Pattern SVG croix pharma en white/5
- Numéro membre : font-mono tracking-wider
- shadow-2xl

Onglet Événements :
- Upcoming events : card avec barre colorée à gauche (primary si confirmed, gold si pending)
- Historique : table sobre avec alternance lignes

Onglet Avantages si NON adhérent :
- Avantages en blur-sm avec overlay centrale "🔒 Réservé aux adhérents"
- CTA grand : "Devenir adhérent — 25 DT/an"
```

---

### PROMPT 0.10 — Pages Auth (Login / Register)

```
Crée /src/app/login/page.tsx et /src/app/register/page.tsx.

Layout split screen desktop :

Gauche (40%) — Panneau brand :
- Dégradé primary-600 → forest-800
- Logo + tagline
- 3 témoignages courts de membres (design quotes, bg-white/10 rounded-2xl)
- Pattern SVG croix pharma en white/5

Droite (60%) — Formulaire :
- Fond bg-neutral-50
- Card bg-white centrée shadow-card-lg rounded-3xl p-10
- Titre font-display text-2xl font-bold
- Composants Input du design system
- Button primary xl w-full
- Lien "Mot de passe oublié" text-primary-600

Register : champs Prénom|Nom côte à côte, puis Email, MDP, Confirm MDP, Année, Téléphone.
Progress bar force mot de passe (barres colorées : rouge→orange→vert).
Validation temps réel : border-primary-400 + CheckCircle icon si valide, border-red-400 + message si invalide.

Mobile : panneau gauche masqué, header minimal avec logo.
```

---

### PROMPT 0.11 — Micro-animations et UX globale

```
Ajoute des micro-animations et améliorations UX dans tout le projet.

1. PAGE TRANSITIONS — /src/components/shared/PageTransition.tsx
   Animation CSS opacity 0→1 + translateY(8px)→0, 300ms ease-out
   Déclenché sur changement de route (usePathname)

2. LIENS ANIMÉS — /src/components/ui/AnimatedLink.tsx
   Underline primary-500 1.5px, scaleX 0→1 au hover (transform-origin left), 200ms
   Utiliser dans Header et Footer.

3. IMAGES FADE-IN — /src/components/ui/FadeImage.tsx
   opacity-0 → opacity-100 onLoad. Skeleton pendant chargement. Transition 500ms.
   Utiliser partout pour les images API.

4. SCROLL-TO-TOP — /src/components/shared/ScrollToTop.tsx
   Bouton fixe bottom-6 right-6, w-12 h-12 bg-primary-500 rounded-full.
   Visible après 300px de scroll (opacity + scale transition).
   window.scrollTo({ top: 0, behavior: 'smooth' })
   Ajouter dans layout.tsx.

5. HOVER CARDS
   Sur toutes les cards d'events et activités :
   - image : group-hover:scale-105 transition-transform duration-500
   - titre : group-hover:text-primary-600 transition-colors
   - trait en bas : after:content-[''] after:absolute after:bottom-0 after:left-0
     after:w-0 after:h-0.5 after:bg-primary-500
     group-hover:after:w-full after:transition-all after:duration-300

6. LOADING BAR — /src/components/shared/LoadingBar.tsx
   Barre 2px top fixed. Dégradé primary-400→primary-600.
   width 0%→90% au start de navigation, 90%→100% + fadeout après 200ms.
   Ajouter dans layout.tsx.

7. REMPLACER TOUS LES window.alert / window.confirm
   - window.alert()   → toast.success() ou toast.error()
   - window.confirm() → composant ConfirmModal
   Passer en revue tout le projet et remplacer.

8. FOCUS STATES COHÉRENTS
   Sur tous les inputs (déjà dans les composants Input/Select) :
   box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15) au focus.
   Supprimer le ring bleu par défaut du browser partout.
```

---

### PROMPT 0.12 — Admin Dashboard (refonte design)

```
Refonds le design du panneau admin.

--- SIDEBAR (layout.tsx) ---

Fond : forest-900 (#022c22)

Nav items :
- Inactif : text-white/60 hover:bg-white/8 hover:text-white rounded-xl transition
- Actif   : bg-primary-500/20 text-primary-300 border-l-2 border-primary-400 rounded-r-none rounded-l-xl
- Badges de compteur (cotisations en attente) : petit cercle rouge/orange

Bas de sidebar :
- Card admin : avatar initiales, nom, "Administrateur" text-white/50
- Bouton déconnexion : text-red-300 hover:text-red-200 hover:bg-red-500/10

Mobile : drawer depuis la gauche (transform translateX), overlay bg-black/40.

--- TABLES ADMIN ---
Header : bg-neutral-100 text-neutral-500 text-xs uppercase tracking-wider
Rows : hover:bg-neutral-50 border-b border-neutral-100
Cells : py-4 px-6 text-neutral-700

--- FORMULAIRES ADMIN ---
Composants Input/Select du design system.
Upload zone : border-2 dashed border-neutral-300 hover:border-primary-400 rounded-2xl.
Preview image : rounded-xl avec bouton X en absolute.

--- STATS CARDS ---
Chiffres : font-display text-4xl text-neutral-900
Variation : flèche ↑ verte ou ↓ rouge
Icône dans carré arrondi bg-primary-100 text-primary-600

--- MAIN CONTENT ---
Fond bg-neutral-50 (pas blanc pur).
Header de page cohérent dans toutes les sections : titre h1 + sous-titre + actions (boutons).
```

---

## PHASE 1 — BACKEND (API Express sur VPS)

---

### PROMPT 1.1 — Initialisation du backend Express

```
Crée un projet backend Node.js/Express complet dans un dossier `/backend` à la racine du projet.

Structure :
/backend
  /src
    /controllers
    /routes
    /middleware
    /models
    /config
  server.js
  package.json
  .env.example

Dependencies : express, cors, helmet, express-validator, dotenv, pg, morgan, bcrypt, jsonwebtoken, multer

.env.example :
DATABASE_URL=postgresql://user:password@localhost:5432/amicale_db
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
PORT=4000
UPLOAD_DIR=./uploads
FRONTEND_URL=http://localhost:3000

server.js :
- CORS depuis FRONTEND_URL
- Helmet, JSON middleware
- GET /api/health
- Error handler global en dernier
- Statique /uploads

Ne crée PAS encore les routes métier.
```

---

### PROMPT 1.2 — Schéma PostgreSQL complet

```
Crée /backend/src/config/schema.sql.

Tables :

1. users
   id SERIAL PK | nom | prenom | email UNIQUE | password_hash | role (member/admin)
   annee (1-6) | telephone | numero_membre UNIQUE | is_adherent BOOLEAN DEFAULT false
   adherent_expires_at TIMESTAMP | created_at | updated_at

2. events
   id SERIAL PK | titre | description | long_description | date TIMESTAMP
   prix | prix_adherent | image_url | capacite | places_restantes
   lieu | categorie | is_published BOOLEAN DEFAULT false | created_at | updated_at

3. registrations
   id SERIAL PK | user_id FK→users | event_id FK→events
   statut (pending/confirmed/cancelled) | montant_paye | methode_paiement
   reference_paiement | created_at | UNIQUE(user_id, event_id)

4. activities
   id SERIAL PK | title | summary | content | category (5 valeurs)
   main_image | gallery_images JSONB DEFAULT '[]' | author_id FK→users
   is_published | published_at | created_at | updated_at

5. enseignants
   id SERIAL PK | nom | titre | specialite | email | linkedin
   photo_url | ordre INT DEFAULT 0 | is_active BOOLEAN DEFAULT true | created_at | updated_at

6. cotisations
   id SERIAL PK | user_id FK | montant | annee_universitaire | methode_paiement
   reference | statut (pending/confirmed/rejected) | confirmed_by FK→users
   confirmed_at | created_at

Index sur : email, role, is_published, date, categorie, statut.
Trigger updated_at sur toutes les tables.
Admin par défaut : admin@fphm.tn / 'Admin2026!' (commentaire SQL pour changer).
```

---

### PROMPT 1.3 — Auth (inscription, connexion, JWT)

```
Fichiers :
- /backend/src/controllers/authController.js
- /backend/src/routes/authRoutes.js
- /backend/src/middleware/authMiddleware.js
- /backend/src/middleware/adminMiddleware.js

POST /api/auth/register — { nom, prenom, email, password, annee, telephone }
  Validation, email unique, bcrypt (rounds 12), numero_membre auto FPHM-{YEAR}-{id},
  retourne JWT + user info (sans password_hash)

POST /api/auth/login — { email, password }
  Retourne JWT + { id, nom, prenom, email, role, is_adherent, adherent_expires_at, numero_membre }

GET /api/auth/me — Bearer token → profil frais depuis DB

POST /api/auth/change-password — { current_password, new_password }

authMiddleware : extrait token, vérifie JWT_SECRET, attache req.user, 401 si invalide.
adminMiddleware : vérifie req.user.role === 'admin', 403 sinon.
```

---

### PROMPT 1.4 — API Events CRUD

```
Fichiers :
- /backend/src/controllers/eventController.js
- /backend/src/routes/eventRoutes.js

GET    /api/events             — Public, ?categorie=&search=&upcoming=true
GET    /api/events/:id         — Public
POST   /api/events             — Admin
PUT    /api/events/:id         — Admin
DELETE /api/events/:id         — Admin
PATCH  /api/events/:id/publish — Admin (toggle is_published)
POST   /api/events/:id/upload-image — Admin, multer, /uploads/events/

GET    /api/events/:id/registrations         — Admin
POST   /api/events/:id/register              — Auth requise
  Vérifie places, calcule prix (prix_adherent si is_adherent actif), crée registration pending
PATCH  /api/events/:id/registrations/:id/confirm — Admin
PATCH  /api/events/:id/registrations/:id/cancel  — Admin ou propriétaire
```

---

### PROMPT 1.5 — API Activities, Enseignants, Members, Cotisations

```
ACTIVITIES :
GET/POST /api/activities | GET/PUT/DELETE /api/activities/:id
PATCH /api/activities/:id/publish
POST /api/activities/:id/upload-image (multer)
POST /api/activities/:id/upload-gallery (multer array, max 6)
DELETE /api/activities/:id/gallery/:index

ENSEIGNANTS :
GET /api/enseignants (public, ordre ASC)
POST/PUT/DELETE /api/enseignants/:id (admin)
PATCH /api/enseignants/:id/reorder — { ordre }
POST /api/enseignants/:id/upload-photo (multer)

MEMBERS :
GET /api/members/me/profile — Auth
GET /api/members/me/events — Auth
GET/PUT/DELETE /api/admin/members/:id — Admin
GET /api/admin/members — Admin, ?search=&is_adherent=

COTISATIONS :
POST /api/cotisations/submit — Auth
GET /api/admin/cotisations — Admin, ?statut=
PATCH /api/admin/cotisations/:id/confirm — Admin → is_adherent=true + adherent_expires_at=30-Sept-N+1
PATCH /api/admin/cotisations/:id/reject — Admin

STATS :
GET /api/admin/stats — Admin
{ total_members, adherents_actifs, events_total, events_a_venir,
  cotisations_en_attente, inscriptions_ce_mois, revenus_total }
```

---

### PROMPT 1.6 — Montage des routes dans server.js

```
Monter toutes les routes dans /backend/server.js :
- /api/auth | /api/events | /api/activities | /api/enseignants | /api/members | /api/cotisations
- Route 404 catch-all

Au démarrage :
- fs.mkdirSync('./uploads/events', { recursive: true })
- fs.mkdirSync('./uploads/activities', { recursive: true })
- fs.mkdirSync('./uploads/enseignants', { recursive: true })

Créer /backend/src/config/db.js :
- Pool pg depuis DATABASE_URL
- Export function query(text, params) { return pool.query(text, params) }
```

---

## PHASE 2 — FRONTEND : Couche API Client

---

### PROMPT 2.1 — Service API centralisé

```
Crée /src/lib/api/ :

client.ts — ApiClient, baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
  Authorization Bearer auto depuis localStorage, gestion erreurs HTTP, methods get/post/put/patch/delete.
  Singleton : export const api = new ApiClient()

auth.ts — login, register, getMe, saveToken, getToken, removeToken, isLoggedIn
events.ts — getEvents(filters?), getEvent(id), createEvent, updateEvent, deleteEvent,
  publishEvent, uploadEventImage, registerToEvent, getEventRegistrations, confirmRegistration
activities.ts — getActivities, getActivity, createActivity, updateActivity, deleteActivity,
  publishActivity, uploadMainImage, uploadGalleryImages, deleteGalleryImage
enseignants.ts — getEnseignants, createEnseignant, updateEnseignant, deleteEnseignant, uploadPhoto, reorder
members.ts — getMyProfile, getMyEvents, submitCotisation, getAllMembers, updateMember,
  deleteMember, getCotisations, confirmCotisation, rejectCotisation, getAdminStats

types.ts — Toutes les interfaces TypeScript : User, Event, Activity, Enseignant, Registration, Cotisation, Stats

utils/imageUrl.ts :
export function getImageUrl(path?: string | null): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${process.env.NEXT_PUBLIC_API_URL}${path}`
}
```

---

### PROMPT 2.2 — Context Auth global

```
Crée /src/contexts/AuthContext.tsx

Expose : user, isLoading, isAuthenticated, isAdmin, isAdherent,
  login(email, password), logout(), register(data), refreshUser()

Comportement :
- Au montage : token localStorage + GET /api/auth/me
- login() : save token, set user, redirect /dashboard
- logout() : supprime token, redirect /

/src/components/shared/ProtectedRoute.tsx
  Props : requireAuth, requireAdmin, requireAdherent

/src/components/shared/AdherentGate.tsx
  Message motivant + CTA avec le design défini dans 0.9

Ajouter AuthProvider dans /src/app/layout.tsx.

Créer /src/app/login/page.tsx et /src/app/register/page.tsx
en utilisant le design du Prompt 0.10.
```

---

## PHASE 3 — PAGES BRANCHÉES SUR L'API

---

### PROMPT 3.1 — Events sur l'API réelle

```
Refactorise /src/app/events/page.tsx et [id]/page.tsx.

- Remplacer mockEvents par getEvents() / getEvent()
- SkeletonCard pendant le fetch, EmptyState si vide ou erreur
- Prix adhérent affiché (useAuth + isAdherent)
- RegisterEventModal : champs méthode + référence → registerToEvent()
- Après inscription : toast.success("Inscription enregistrée ! En attente de confirmation.")
- Appliquer le design du Prompt 0.6
```

---

### PROMPT 3.2 — Activities sur l'API réelle

```
- Remplacer mockActivities par getActivities() / getActivity()
- Debounce 300ms sur search
- react-markdown avec styles prose du Prompt 0.7
- Lightbox galerie (Modal fullscreen, nav prev/next)
- SkeletonCard / EmptyState
- Appliquer le design du Prompt 0.7
```

---

### PROMPT 3.3 — Enseignants sur l'API réelle

```
- Remplacer mock par getEnseignants()
- Photos via getImageUrl()
- SkeletonCard / EmptyState
- Appliquer le design du Prompt 0.8
```

---

### PROMPT 3.4 — Dashboard Membre sur l'API réelle

```
- useAuth() + getMyProfile() + getMyEvents() au montage
- Vraies données : numero_membre, adherent_expires_at, registrations avec statuts
- Badge statuts : pending=gold, confirmed=primary
- CotisationModal : submitCotisation() → toast.success
- AdherentGate dans l'onglet Avantages si !isAdherent
- Appliquer le design du Prompt 0.9
```

---

## PHASE 4 — ADMIN DASHBOARD (entièrement fonctionnel)

---

### PROMPT 4.1 — Admin Layout + auth guard

```
- useAuth() → si !isAdmin : redirect /
- Loader pendant isLoading
- Badge cotisations en attente (fetch /api/admin/stats)
- Avatar admin en bas de sidebar
- logout() du context
- Items nav : Dashboard | Événements | Actualités | Enseignants | Membres | Cotisations | Finances
- Design du Prompt 0.12 (sidebar forest-900)
- Mobile drawer avec overlay
```

---

### PROMPT 4.2 — Admin Dashboard stats réelles

```
- Fetch /api/admin/stats au montage
- Stat cards avec vraies valeurs (design Prompt 0.12)
- BarChart recharts inscriptions par mois
- Tableau 6 dernières inscriptions
- Section "Actions rapides" : 3 boutons raccourcis
```

---

### PROMPT 4.3 — Admin Events CRUD complet

```
- Fetch tous les events (publiés + brouillons)
- Badge is_published vert/gris
- Actions : Éditer | Publier/Dépublier | Inscrits | Supprimer
- Formulaire création/édition avec preview image upload
- Modal inscrits : tableau + Confirmer/Annuler par ligne + export CSV
- Supprimer → ConfirmModal (pas window.confirm)
- Toast sur toutes les actions
- Design du Prompt 0.12
```

---

### PROMPT 4.4 — Admin Activities CRUD complet

```
- Fetch toutes les activities (publiées + brouillons)
- Formulaire : titre, catégorie (avec indicateur couleur), résumé, content
- Upload image principale + galerie (preview grid avec bouton ❌)
- Prévisualisation markdown (panel latéral react-markdown)
- Publish/unpublish, edit, delete avec ConfirmModal
- Toast sur toutes les actions
```

---

### PROMPT 4.5 — Admin Enseignants CRUD

```
Crée /src/app/admin/enseignants/page.tsx.

- Fetch getEnseignants() (tous)
- Grid avec photo/placeholder, nom, titre
- Boutons ↑↓ pour réordonner (reorder())
- Toggle is_active via switch
- Modal formulaire : nom, titre, spécialité, email, linkedin, photo (preview ronde)
- createEnseignant / updateEnseignant / uploadPhoto / deleteEnseignant
- ConfirmModal pour suppression, toast sur toutes les actions
```

---

### PROMPT 4.6 — Admin Membres + Cotisations

```
/src/app/admin/members/page.tsx avec 2 onglets.

Onglet MEMBRES :
- getAllMembers(), filtres search + adhérent
- Colonnes : Nom | Email | Année | Adhérent (Badge) | Rôle | Actions
- Modifier → modal édition
- Supprimer → ConfirmModal
- Export CSV

Onglet COTISATIONS :
- getCotisations(), filtre statut
- Colonnes : Membre | Méthode | Référence | Statut (Badge) | Date | Actions
- Si pending : "✓ Confirmer" + "✗ Rejeter"
- confirmCotisation() → toast.success + update locale
- rejectCotisation() → toast.warning + update locale
- Badge "X en attente" dans le tab
```

---

## PHASE 5 — FINITIONS ET DÉPLOIEMENT

---

### PROMPT 5.1 — Variables d'environnement

```
Créer /.env.local.example : NEXT_PUBLIC_API_URL=http://localhost:4000
Dans client.ts : baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'
Utiliser getImageUrl() partout pour les images API.
Vérifier que next.config.ts expose bien les NEXT_PUBLIC_* vars.
```

---

### PROMPT 5.2 — Nettoyage mocks + homepage

```
1. Vider /src/lib/mockData.ts et /src/lib/mockActivities.ts (contenu → commentaire DEPRECATED)
2. Vérifier absence d'imports mock dans les pages
3. /src/components/home/EventsSection.tsx → async Server Component
   fetch getEvents({ upcoming: true, limit: 3 }), Suspense fallback SkeletonCard
4. /src/app/page.tsx : Suspense boundaries autour des sections qui fetchent
```

---

### PROMPT 5.3 — Déploiement VPS

```
/backend/ecosystem.config.js (PM2 config).
/backend/DEPLOY.md avec instructions complètes :
1. VPS : Node.js 20+, PostgreSQL, PM2, Nginx
2. Clone repo, npm install --production
3. Créer DB, exécuter schema.sql
4. Configurer .env
5. pm2 start ecosystem.config.js --env production && pm2 save && pm2 startup
6. Nginx : proxy /api → 4000, proxy / → 3000 (Next.js)
7. SSL : certbot --nginx -d ton-domaine.com
8. Next.js : npm run build, pm2 start "npm start" --name amicale-frontend
```

---

## 📌 ORDRE D'EXÉCUTION RECOMMANDÉ

```
PHASE 0 — Design System (EN PREMIER — impacte tout)
  0.1  Tailwind config + tokens + couleur verte
  0.2  Composants UI (Button, Card, Input, Modal, Toast, ConfirmModal...)
  0.3  Header
  0.4  Footer
  0.5  Homepage
  0.6  Page Events
  0.7  Page Activities
  0.8  Page Enseignants
  0.9  Dashboard Membre
  0.10 Pages Auth
  0.11 Micro-animations et UX
  0.12 Admin design

PHASE 1 — Backend
  1.1 → 1.6 (architecture + DB + auth + APIs + routes)
  → TEST : curl http://localhost:4000/api/health ✓

PHASE 2 — Client API
  2.1 Services TypeScript
  2.2 AuthContext

PHASE 3 — Pages branchées
  3.1 Events | 3.2 Activities | 3.3 Enseignants | 3.4 Dashboard

PHASE 4 — Admin fonctionnel
  4.1 Layout | 4.2 Stats | 4.3 Events | 4.4 Activities | 4.5 Enseignants | 4.6 Membres

PHASE 5 — Production
  5.1 Env | 5.2 Nettoyage | 5.3 Déploiement
```

---

## 💎 CHARTE DESIGN — RÉFÉRENCE RAPIDE

```
COULEURS
  Primaire      : #22c55e (green-500) — boutons, liens actifs, accents
  Primaire dark : #16a34a (green-600) — hover
  Forest        : #065f46             — titres forts, sidebar admin
  Background    : #f8faf9             — fond de l'app
  Surface       : #ffffff             — cards, panels
  Border        : #e5ebe6             — séparateurs
  Text main     : #141a15
  Text muted    : #9aab9d
  Gold accent   : #f59e0b             — badges premium, tarif adhérent, pending

TYPOGRAPHIE
  Display (titres) : Bricolage Grotesque — audacieux, distinctif
  Body (texte/UI)  : Instrument Sans — lisible, moderne
  Mono (codes/IDs) : JetBrains Mono

ESPACEMENTS
  Arrondi cards : rounded-2xl (16px) à rounded-3xl (24px)
  Padding cards : p-6 à p-8
  Gap grilles   : gap-6 à gap-8

OMBRES
  Default : shadow-card  (subtile, teintée vert)
  Hover   : shadow-card-lg
  CTA     : shadow-glow  (effet lumineux vert pour les boutons primaires importants)

ANIMATIONS
  Hover cards   : -translate-y-1 + shadow upgrade
  Hover liens   : underline scaleX 0→1
  Zoom images   : group-hover:scale-105 (duration-500)
  Chargement    : animate-fade-up avec staggered delays (150ms entre éléments)
  Transitions   : duration-200 à duration-300, ease-out

RÈGLES UX — NON NÉGOCIABLES
  ✓ Skeleton loader pendant chaque fetch (jamais de page blanche)
  ✓ Toast au lieu de window.alert / window.confirm
  ✓ ConfirmModal pour toutes les suppressions
  ✓ EmptyState illustré si liste vide
  ✓ Focus states visibles et cohérents (ring primary, pas le ring bleu browser)
  ✓ Mobile-first sur toutes les pages
  ✓ Images avec fade-in (FadeImage component)
  ✓ Pas de reload de page pour les actions CRUD — mise à jour de l'état local
```

---

## 💡 NOTES IMPORTANTES POUR CURSOR

```
- ES Modules (import/export) côté Next.js ; CommonJS (require) côté Express
- La couleur primaire est VERTE. Ne pas réintroduire le bleu comme couleur principale.
- Cohérence absolue : même border-radius, même shadows, mêmes fonts partout
- Toujours utiliser les composants du design system (Button, Card, Input, Modal, Toast)
  — ne pas recréer des styles inline redondants
- Google Fonts chargées dans globals.css uniquement, pas dans chaque composant
- Uploads : accepter jpg, jpeg, png, webp, max 5MB
- Routes admin : toujours vérifier le rôle admin (middleware adminMiddleware)
- Ne pas casser les routes Next.js existantes (structure App Router conservée)
```
