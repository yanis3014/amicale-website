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

## Créer l’admin par défaut

Après le premier utilisateur inscrit, ou manuellement avec un hash bcrypt pour le mot de passe `Admin2026!` :

```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('Admin2026!',12).then(h=>console.log(h));"
```

Puis en SQL :

```sql
INSERT INTO users (nom, prenom, email, password_hash, role, numero_membre)
VALUES ('Admin', 'FPHM', 'admin@fphm.tn', '<hash_genere>', 'admin', 'ADMIN-001');
```

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
