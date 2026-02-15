# 📸 Guide d'ajout d'images pour les événements

## Structure des dossiers

```
public/
  images/
    events/
      ├── 50eme-anniversaire.jpg           ← VOTRE IMAGE ICI
      ├── conference-innovation.jpg        ← VOTRE IMAGE ICI
      ├── formation-secours.jpg            ← VOTRE IMAGE ICI
      └── atelier-concours.jpg             ← VOTRE IMAGE ICI
```

## ✅ Étapes pour ajouter des images

### 1. **Préparer vos images**

- **Format recommandé** : JPG ou PNG
- **Dimensions optimales** : 800x450px (ratio 16:9)
- **Poids** : < 500 KB (compressez si nécessaire)
- **Nommage** : Utilisez des noms clairs en minuscules avec tirets
  - ✅ `gala-2026.jpg`
  - ✅ `conference-innovation.jpg`
  - ❌ `IMG_1234.jpg`

### 2. **Placer les images**

Copiez vos images dans : `public/images/events/`

### 3. **Mettre à jour mockData.ts** (Déjà fait ✅)

Les URLs sont déjà configurées dans `src/lib/mockData.ts` :

```typescript
{
  id: '1',
  titre: '50ème anniversaire FPHM',
  image_url: '/images/events/50eme-anniversaire.jpg',  // ← Chemin de l'image
  ...
}
```

### 4. **Créer le dossier si nécessaire**

Si le dossier `public/images/events/` n'existe pas :

```bash
mkdir -p public/images/events
```

---

## 🎨 Sources d'images gratuites

Si vous n'avez pas encore vos propres photos :

1. **Unsplash** : https://unsplash.com/
   - Recherches : "medical conference", "gala event", "training session"

2. **Pexels** : https://www.pexels.com/
   - Recherches : "pharmacy", "university event", "professional training"

3. **Pixabay** : https://pixabay.com/
   - Toutes les images sont libres de droits

---

## 🔄 Pour plus tard : Migration vers Supabase Storage

Quand vous serez prêt à stocker les images dans Supabase :

### 1. Créer un bucket Supabase

```sql
-- Dans Supabase Dashboard > Storage
CREATE BUCKET events_images;
```

### 2. Uploader via le dashboard ou l'API

```typescript
// Exemple d'upload
const { data, error } = await supabase.storage
  .from('events_images')
  .upload('gala-2026.jpg', file);
```

### 3. Mettre à jour les URLs dans la base

```sql
UPDATE events 
SET image_url = 'https://votre-projet.supabase.co/storage/v1/object/public/events_images/50eme-anniversaire.jpg'
WHERE id = '1';
```

---

## 🚀 Tester localement

1. **Placez vos 4 images** dans `public/images/events/`
2. **Redémarrez le serveur** : `npm run dev`
3. **Visitez** : http://localhost:3000/events
4. Les images devraient s'afficher automatiquement !

---

## ⚠️ Si l'image ne s'affiche pas

**Vérifications :**
- ✅ L'image existe bien dans `public/images/events/`
- ✅ Le nom du fichier correspond exactement (attention à la casse)
- ✅ Le serveur Next.js a été redémarré
- ✅ Pas d'espace ou de caractères spéciaux dans le nom

**Fallback** : Si l'image manque, un placeholder avec l'icône calendrier s'affichera automatiquement.

---

## 📝 Exemple complet

```
1. Téléchargez une image du 50ème anniversaire ou d'événement universitaire
2. Renommez-la : 50eme-anniversaire.jpg
3. Copiez-la dans : public/images/events/50eme-anniversaire.jpg
4. L'image apparaît automatiquement sur la page /events !
```

✨ **C'est tout ! Les images sont maintenant affichées sur votre site.**
