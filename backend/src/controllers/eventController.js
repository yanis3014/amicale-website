const { body, validationResult, query: q } = require('express-validator');
const { query } = require('../config/db');

exports.list = async (req, res) => {
  try {
    const { categorie, search, upcoming } = req.query;
    let sql = `
      SELECT id, titre, description, long_description, date, prix, prix_adherent, image_url,
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
    if (upcoming === 'true') {
      sql += ` AND date >= NOW()`;
    }
    sql += ` ORDER BY date ASC`;
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
      `SELECT id, titre, description, long_description, date, prix, prix_adherent, image_url,
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
        titre, description, long_description, date, prix = 0, prix_adherent,
        capacite = 0, lieu, categorie
      } = req.body;
      const result = await query(
        `INSERT INTO events (titre, description, long_description, date, prix, prix_adherent, capacite, places_restantes, lieu, categorie)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8, $9)
         RETURNING *`,
        [titre, description || null, long_description || null, date, prix, prix_adherent || null, capacite, lieu || null, categorie || null]
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
  body('prix').optional().isFloat({ min: 0 }),
  body('prix_adherent').optional().isFloat({ min: 0 }),
  body('capacite').optional().isInt({ min: 0 }),
  body('lieu').optional().trim(),
  body('categorie').optional().trim(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const id = req.params.id;
      const fields = ['titre', 'description', 'long_description', 'date', 'prix', 'prix_adherent', 'capacite', 'lieu', 'categorie'];
      const updates = [];
      const values = [];
      let i = 1;
      for (const f of fields) {
        if (req.body[f] !== undefined) {
          updates.push(`${f} = $${i}`);
          values.push(req.body[f]);
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

// Registrations
exports.getRegistrations = async (req, res) => {
  try {
    const result = await query(
      `SELECT r.*, u.nom, u.prenom, u.email, u.numero_membre
       FROM registrations r
       JOIN users u ON u.id = r.user_id
       WHERE r.event_id = $1 ORDER BY r.created_at DESC`,
      [req.params.id]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.registerToEvent = [
  body('methode_paiement').optional().trim(),
  body('reference_paiement').optional().trim(),
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
      const montant = isAdherent && event.prix_adherent != null ? event.prix_adherent : event.prix;
      await query(
        `INSERT INTO registrations (user_id, event_id, statut, montant_paye, methode_paiement, reference_paiement)
         VALUES ($1, $2, 'pending', $3, $4, $5)`,
        [userId, eventId, montant, req.body.methode_paiement || null, req.body.reference_paiement || null]
      );
      await query('UPDATE events SET places_restantes = places_restantes - 1 WHERE id = $1', [eventId]);
      const reg = await query(
        'SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2',
        [userId, eventId]
      );
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
