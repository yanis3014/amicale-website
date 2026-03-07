# Backend Amicale FPHM — API Express + PostgreSQL

## Prérequis

- Node.js 18+
- PostgreSQL

## Installation

```bash
cd backend
cp .env.example .env
# Éditer .env : DATABASE_URL, JWT_SECRET, etc.
npm install
```

## Base de données

Créer la base et exécuter le schéma :

```bash
createdb amicale_db
psql $env:DATABASE_URL -f src/config/schema.sql
```

Sous Linux/Mac : `psql $DATABASE_URL -f src/config/schema.sql`

## Créer le compte admin

**Méthode recommandée — script :**

Depuis le dossier `backend`, avec la base de données déjà créée et le fichier `.env` configuré (`DATABASE_URL`) :

```bash
node scripts/create-admin.js
```

Cela crée un compte avec :
- **Email :** `admin@fphm.tn`
- **Mot de passe :** `Admin2026!`

Pour personnaliser (optionnel), définir avant d’exécuter le script :
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NOM`, `ADMIN_PRENOM`

Exemple (PowerShell) :
```powershell
$env:ADMIN_EMAIL="moi@example.com"; $env:ADMIN_PASSWORD="MonMotDePasseSecurise"; node scripts/create-admin.js
```

Ensuite, connectez-vous sur le site avec ces identifiants et accédez à `/admin`.

## Démarrer le serveur

```bash
npm start
```

Le serveur écoute sur `http://localhost:4000` (ou `PORT` dans `.env`).

## Vérification

```bash
curl http://localhost:4000/api/health
# → {"ok":true,"message":"Amicale FPHM API"}
```

## Routes principales

- `GET /api/health` — Santé
- `POST /api/auth/register` — Inscription
- `POST /api/auth/login` — Connexion
- `GET /api/auth/me` — Profil (Bearer)
- `GET /api/events` — Liste événements (public)
- `GET /api/activities` — Liste activités (public)
- `GET /api/enseignants` — Liste enseignants (public)
- Admin : `/api/admin/stats`, `/api/admin/members`, `/api/admin/cotisations`, etc.
