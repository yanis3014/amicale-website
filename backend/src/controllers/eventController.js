const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');
const { sendConfirmationEventRegistration } = require('../services/emailService');

// Admin: liste tous les événements (publiés + brouillons)
exports.listAdmin = async (req, res) => {
  try {
    let sql = `
      SELECT id, titre, description, long_description, date, date_fin, prix, prix_adherent, image_url,
             COALESCE(gallery_images, '[]'::jsonb) AS gallery_images,
             capacite, places_restantes, lieu, categorie, is_published, featured_on_home, home_order, created_at
      FROM events
      ORDER BY date DESC
    `;
    const result = await query(sql);
    return res.json(result.rows);
  } catch (err) {
    console.error('[listAdmin]', err.message, err.stack);
    return res.status(500).json({
      error: 'Erreur serveur',
      hint: process.env.NODE_ENV !== 'production' ? err.message : undefined,
    });
  }
};

// Page d'accueil : événements mis en avant (publiés, à venir, ordre home_order)
exports.listFeatured = async (req, res) => {
  try {
    const result = await query(`
      SELECT id, titre, description, long_description, date, date_fin, prix, prix_adherent, image_url,
             COALESCE(gallery_images, '[]'::jsonb) AS gallery_images,
             capacite, places_restantes, lieu, categorie, is_published, featured_on_home, home_order, created_at
      FROM events
      WHERE is_published = true AND featured_on_home = true AND COALESCE(date_fin, date) >= NOW()
      ORDER BY home_order ASC, date ASC
    `);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.list = async (req, res) => {
  try {
    const { categorie, search, upcoming, past } = req.query;
    let sql = `
      SELECT id, titre, description, long_description, date, date_fin, prix, prix_adherent, image_url,
             COALESCE(gallery_images, '[]'::jsonb) AS gallery_images,
             capacite, places_restantes, lieu, categorie, is_published, created_at
      FROM events WHERE 1=1
    `;
    const params = [];
    let i = 1;
    // Liste publique : uniquement les événements publiés
    sql += ` AND is_published = true`;
    if (categorie) {
      sql += ` AND categorie = $${i}`;
      params.push(categorie);
      i++;
    }
    if (search) {
      sql += ` AND (titre ILIKE $${i} OR description ILIKE $${i})`;
      params.push(`%${search}%`);
      i++;
    }
    // Annonces (à venir) : visible jusqu'à date_fin ; passés : après date_fin (ou date si pas de date_fin)
    if (upcoming === 'true') {
      sql += ` AND COALESCE(date_fin, date) >= NOW()`;
    }
    if (past === 'true') {
      sql += ` AND COALESCE(date_fin, date) < NOW()`;
    }
    sql += ` ORDER BY date ${past === 'true' ? 'DESC' : 'ASC'}`;
    const result = await query(sql, params);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, titre, description, long_description, date, date_fin, prix, prix_adherent, image_url,
              COALESCE(gallery_images, '[]'::jsonb) AS gallery_images,
              capacite, places_restantes, lieu, categorie, is_published, created_at
       FROM events WHERE id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Événement introuvable' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.create = [
  body('titre').trim().notEmpty().withMessage('Titre requis'),
  body('description').optional().trim(),
  body('long_description').optional().trim(),
  body('date').notEmpty().withMessage('Date requise'),
  body('date_fin').optional(),
  body('prix').optional().isFloat({ min: 0 }).withMessage('Prix invalide'),
  body('prix_adherent').optional().isFloat({ min: 0 }),
  body('capacite').optional().isInt({ min: 0 }),
  body('lieu').optional().trim(),
  body('categorie').optional().trim(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const {
        titre, description, long_description, date, date_fin, prix = 0, prix_adherent,
        capacite = 0, lieu, categorie
      } = req.body;
      const result = await query(
        `INSERT INTO events (titre, description, long_description, date, date_fin, prix, prix_adherent, capacite, places_restantes, lieu, categorie)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $8, $9, $10)
         RETURNING *`,
        [titre, description || null, long_description || null, date, date_fin || null, prix, prix_adherent || null, capacite, lieu || null, categorie || null]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

exports.update = [
  body('titre').optional().trim().notEmpty(),
  body('description').optional().trim(),
  body('long_description').optional().trim(),
  body('date').optional(),
  body('date_fin').optional(),
  body('prix').optional().isFloat({ min: 0 }),
  body('prix_adherent').optional().isFloat({ min: 0 }),
  body('capacite').optional().isInt({ min: 0 }),
  body('lieu').optional().trim(),
  body('categorie').optional().trim(),
  body('featured_on_home').optional().isBoolean(),
  body('home_order').optional().isInt({ min: 0 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const id = req.params.id;
      const fields = ['titre', 'description', 'long_description', 'date', 'date_fin', 'prix', 'prix_adherent', 'capacite', 'lieu', 'categorie', 'featured_on_home', 'home_order'];
      const updates = [];
      const values = [];
      let i = 1;
      for (const f of fields) {
        if (req.body[f] !== undefined) {
          updates.push(`${f} = $${i}`);
          const val = f === 'date_fin' && (req.body[f] === '' || req.body[f] == null) ? null : req.body[f];
          values.push(val);
          i++;
        }
      }
      if (req.body.capacite !== undefined) {
        const current = await query('SELECT places_restantes, capacite FROM events WHERE id = $1', [id]);
        if (current.rows.length > 0) {
          const cap = req.body.capacite;
          const taken = current.rows[0].capacite - current.rows[0].places_restantes;
          const places_restantes = Math.max(0, cap - taken);
          updates.push(`places_restantes = $${i}`);
          values.push(places_restantes);
          i++;
        }
      }
      if (updates.length === 0) {
        const r = await query('SELECT * FROM events WHERE id = $1', [id]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'Événement introuvable' });
        return res.json(r.rows[0]);
      }
      values.push(id);
      const result = await query(
        `UPDATE events SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
        values
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Événement introuvable' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

exports.remove = async (req, res) => {
  try {
    const result = await query('DELETE FROM events WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Événement introuvable' });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.publish = async (req, res) => {
  try {
    const result = await query(
      'UPDATE events SET is_published = NOT is_published WHERE id = $1 RETURNING id, is_published',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Événement introuvable' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Fichier image requis' });
    const url = `/uploads/events/${req.file.filename}`;
    await query('UPDATE events SET image_url = $1 WHERE id = $2', [url, req.params.id]);
    const result = await query('SELECT id, image_url FROM events WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Événement introuvable' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Galerie : événements passés (annonces)
exports.uploadEventGallery = async (req, res) => {
  try {
    const id = req.params.id;
    const current = await query('SELECT COALESCE(gallery_images, \'[]\'::jsonb) AS gallery_images FROM events WHERE id = $1', [id]);
    if (current.rows.length === 0) return res.status(404).json({ error: 'Événement introuvable' });
    let gallery = current.rows[0].gallery_images || [];
    if (!Array.isArray(gallery)) gallery = [];
    const files = req.files || [];
    const maxImages = 20;
    if (gallery.length + files.length > maxImages) return res.status(400).json({ error: `Maximum ${maxImages} images en galerie` });
    for (const f of files) {
      gallery.push(`/uploads/events/${f.filename}`);
    }
    await query('UPDATE events SET gallery_images = $1 WHERE id = $2', [JSON.stringify(gallery), id]);
    const result = await query('SELECT id, gallery_images FROM events WHERE id = $1', [id]);
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteEventGalleryImage = async (req, res) => {
  try {
    const id = req.params.id;
    const index = parseInt(req.params.index, 10);
    if (isNaN(index) || index < 0) return res.status(400).json({ error: 'Index invalide' });
    const current = await query('SELECT COALESCE(gallery_images, \'[]\'::jsonb) AS gallery_images FROM events WHERE id = $1', [id]);
    if (current.rows.length === 0) return res.status(404).json({ error: 'Événement introuvable' });
    let gallery = current.rows[0].gallery_images || [];
    if (!Array.isArray(gallery)) gallery = [];
    if (index >= gallery.length) return res.status(404).json({ error: 'Image introuvable' });
    gallery.splice(index, 1);
    await query('UPDATE events SET gallery_images = $1 WHERE id = $2', [JSON.stringify(gallery), id]);
    const result = await query('SELECT id, gallery_images FROM events WHERE id = $1', [id]);
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Registrations (membres + invités : LEFT JOIN users, guest_* si user_id NULL)
exports.getRegistrations = async (req, res) => {
  try {
    const result = await query(
      `SELECT r.*,
              u.nom, u.prenom, u.email, u.numero_membre,
              r.guest_nom, r.guest_prenom, r.guest_email, r.guest_telephone
       FROM registrations r
       LEFT JOIN users u ON u.id = r.user_id
       WHERE r.event_id = $1 ORDER BY r.created_at DESC`,
      [req.params.id]
    );
    const rows = result.rows.map((row) => ({
      ...row,
      nom: row.nom ?? row.guest_nom,
      prenom: row.prenom ?? row.guest_prenom,
      email: row.email ?? row.guest_email,
    }));
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.registerToEvent = [
  body('methode_paiement').optional().trim(),
  body('reference_paiement').optional().trim(),
  body('titulaire_compte').optional().trim(),
  body('carte_expiry').optional().trim(),
  async (req, res) => {
    try {
      const eventId = req.params.id;
      const userId = req.user.id;
      const eventResult = await query(
        'SELECT id, places_restantes, prix, prix_adherent FROM events WHERE id = $1',
        [eventId]
      );
      if (eventResult.rows.length === 0) {
        return res.status(404).json({ error: 'Événement introuvable' });
      }
      const event = eventResult.rows[0];
      if (event.places_restantes <= 0) {
        return res.status(400).json({ error: 'Plus de places disponibles' });
      }
      const existing = await query('SELECT id FROM registrations WHERE user_id = $1 AND event_id = $2', [userId, eventId]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Vous êtes déjà inscrit à cet événement' });
      }
      const userResult = await query('SELECT is_adherent, adherent_expires_at FROM users WHERE id = $1', [userId]);
      const isAdherent = userResult.rows[0]?.is_adherent && userResult.rows[0]?.adherent_expires_at && new Date(userResult.rows[0].adherent_expires_at) > new Date();
      const montant = isAdherent && event.prix_adherent != null ? Number(event.prix_adherent) : Number(event.prix);
      // Paiement simulé par carte : on stocke uniquement nom sur carte, ****derniers4, date expiration (jamais numéro complet ni CVV)
      const methodePaiement = req.body.reference_paiement ? 'carte' : 'Simulation';
      const referencePaiement = req.body.reference_paiement || `SIM-${Date.now()}`;
      const titulaireCompte = (req.body.titulaire_compte || '').trim() || null;
      const carteExpiry = (req.body.carte_expiry || '').trim() || null;
      await query(
        `INSERT INTO registrations (user_id, event_id, statut, montant_paye, methode_paiement, reference_paiement, titulaire_compte, carte_expiry)
         VALUES ($1, $2, 'confirmed', $3, $4, $5, $6, $7)`,
        [userId, eventId, montant, methodePaiement, referencePaiement, titulaireCompte, carteExpiry]
      );
      await query('UPDATE events SET places_restantes = places_restantes - 1 WHERE id = $1', [eventId]);
      const reg = await query(
        'SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2',
        [userId, eventId]
      );
      const eventFull = await query(
        'SELECT id, titre, date, lieu FROM events WHERE id = $1',
        [eventId]
      );
      const userRow = await query('SELECT nom, prenom, email FROM users WHERE id = $1', [userId]);
      const u = userRow.rows[0];
      const ev = eventFull.rows[0];
      if (ev && u) {
        sendConfirmationEventRegistration({
          toEmail: u.email,
          toName: `${u.prenom} ${u.nom}`.trim(),
          event: ev,
          isGuest: false,
        }).catch((e) => console.error('Envoi email confirmation:', e));
      }
      return res.status(201).json(reg.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

// Inscription invité (sans compte) — pas d'auth
exports.registerToEventGuest = [
  body('nom').trim().notEmpty().withMessage('Nom requis'),
  body('prenom').trim().notEmpty().withMessage('Prénom requis'),
  body('email').trim().isEmail().withMessage('Email invalide'),
  body('telephone').optional().trim(),
  body('methode_paiement').optional().trim(),
  body('reference_paiement').optional().trim(),
  body('titulaire_compte').optional().trim(),
  body('carte_expiry').optional().trim(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0]?.msg || 'Données invalides' });
      }
      const eventId = req.params.id;
      const eventResult = await query(
        'SELECT id, titre, date, lieu, places_restantes, prix, prix_adherent FROM events WHERE id = $1',
        [eventId]
      );
      if (eventResult.rows.length === 0) {
        return res.status(404).json({ error: 'Événement introuvable' });
      }
      const event = eventResult.rows[0];
      if (event.places_restantes <= 0) {
        return res.status(400).json({ error: 'Plus de places disponibles' });
      }
      const { nom, prenom, email, telephone } = req.body;
      const existing = await query(
        'SELECT id FROM registrations WHERE event_id = $1 AND user_id IS NULL AND guest_email = $2',
        [eventId, email]
      );
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Cet email est déjà inscrit à cet événement' });
      }
      const montant = Number(event.prix) || 0;
      // Paiement simulé par carte : on stocke uniquement nom sur carte, ****derniers4, date expiration (jamais numéro complet ni CVV)
      const methodePaiement = req.body.reference_paiement ? 'carte' : 'Simulation';
      const referencePaiement = req.body.reference_paiement || `SIM-${Date.now()}`;
      const titulaireCompte = (req.body.titulaire_compte || '').trim() || null;
      const carteExpiry = (req.body.carte_expiry || '').trim() || null;
      await query(
        `INSERT INTO registrations (user_id, event_id, statut, montant_paye, methode_paiement, reference_paiement, guest_nom, guest_prenom, guest_email, guest_telephone, titulaire_compte, carte_expiry)
         VALUES (NULL, $1, 'confirmed', $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          eventId,
          montant,
          methodePaiement,
          referencePaiement,
          nom,
          prenom,
          email,
          telephone || null,
          titulaireCompte,
          carteExpiry,
        ]
      );
      await query('UPDATE events SET places_restantes = places_restantes - 1 WHERE id = $1', [eventId]);
      const reg = await query(
        'SELECT * FROM registrations WHERE event_id = $1 AND guest_email = $2 AND user_id IS NULL ORDER BY created_at DESC LIMIT 1',
        [eventId, email]
      );
      sendConfirmationEventRegistration({
        toEmail: email,
        toName: `${prenom} ${nom}`.trim(),
        event: { id: event.id, titre: event.titre, date: event.date, lieu: event.lieu },
        isGuest: true,
      }).catch((e) => console.error('Envoi email confirmation invité:', e));
      return res.status(201).json(reg.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

exports.confirmRegistration = async (req, res) => {
  try {
    const result = await query(
      'UPDATE registrations SET statut = \'confirmed\' WHERE id = $1 AND event_id = $2 RETURNING *',
      [req.params.regId, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Inscription introuvable' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const reg = await query('SELECT * FROM registrations WHERE id = $1 AND event_id = $2', [req.params.regId, req.params.id]);
    if (reg.rows.length === 0) return res.status(404).json({ error: 'Inscription introuvable' });
    const isAdmin = req.user.role === 'admin';
    const isOwner = reg.rows[0].user_id === req.user.id;
    if (!isAdmin && !isOwner) return res.status(403).json({ error: 'Non autorisé' });
    await query('UPDATE registrations SET statut = \'cancelled\' WHERE id = $1', [req.params.regId]);
    await query('UPDATE events SET places_restantes = places_restantes + 1 WHERE id = $1', [req.params.id]);
    return res.json({ message: 'Inscription annulée' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
