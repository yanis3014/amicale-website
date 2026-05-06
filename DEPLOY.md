Déploiement : Vercel (frontend) + Render (backend)

## Frontend (Vercel)

1. **Importer le repo** sur [vercel.com](https://vercel.com) (Root Directory = racine du repo).
2. **Variables d’environnement** (Settings → Environment Variables) :
   - `NEXT_PUBLIC_API_URL` = URL du backend Render (ex. `https://amicale-api.onrender.com`)
   - `NEXT_PUBLIC_SUPABASE_URL` = URL du projet Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = clé anon Supabase
3. **Build** : Vercel détecte Next.js et utilise `npm run build` / `next build`. Aucune config supplémentaire nécessaire.

## Backend (Render)

1. **Nouveau Web Service** : connecter le repo GitHub/GitLab.
2. **Root Directory** : `backend` (ou utiliser le `render.yaml` à la racine pour le blueprint).
3. **Build Command** : `npm install`
4. **Start Command** : `npm start`
5. **Variables d’environnement** (Environment) :
   - `DATABASE_URL` = chaîne de connexion PostgreSQL (fournie si vous ajoutez une base Render)
   - `JWT_SECRET` = secret pour les JWT
   - `JWT_EXPIRES_IN` = ex. `7d`
   - `FRONTEND_URL` = URL du frontend Vercel (ex. `https://votre-app.vercel.app`) pour CORS
   - `PORT` : défini automatiquement par Render (ne pas surcharger sauf besoin particulier)
6. **Base de données** : créer une base PostgreSQL sur Render et lier le service ; `DATABASE_URL` sera injectée automatiquement.

**Note** : Sur le plan gratuit, le disque est éphémère ; les fichiers dans `./uploads` ne sont pas persistés entre redémarrages. Pour des uploads persistants, prévoir un stockage externe (ex. S3) ou un disque persistant Render.
