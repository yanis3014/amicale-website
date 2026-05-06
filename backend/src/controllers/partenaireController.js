const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');

exports.list = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM partenaires WHERE is_active = true ORDER BY ordre ASC, nom ASC'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.listAll = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM partenaires ORDER BY ordre ASC, nom ASC'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await query('SELECT * FROM partenaires WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Partenaire introuvable' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.create = [
  body('nom').trim().notEmpty().withMessage('Nom requis'),
  body('url').trim().notEmpty().withMessage('URL requise'),
  body('ordre').isInt({ min: 0 }).withMessage('Ordre requis'),
  body('is_active').isBoolean().withMessage('Statut actif requis'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { nom, url, ordre, is_active } = req.body;
      const result = await query(
        `INSERT INTO partenaires (nom, url, ordre, is_active)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [nom, url, ordre, is_active]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

exports.update = [
  body('nom').optional().trim().notEmpty(),
  body('url').optional().trim(),
  body('ordre').optional().isInt({ min: 0 }),
  body('is_active').optional().isBoolean(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const id = req.params.id;
      const { nom, url, ordre, is_active } = req.body;
      const updates = [];
      const values = [];
      let i = 1;
      if (nom !== undefined) { updates.push(`nom = $${i++}`); values.push(nom); }
      if (url !== undefined) { updates.push(`url = $${i++}`); values.push(url || null); }
      if (ordre !== undefined) { updates.push(`ordre = $${i++}`); values.push(ordre); }
      if (is_active !== undefined) { updates.push(`is_active = $${i++}`); values.push(is_active); }
      if (updates.length === 0) {
        const r = await query('SELECT * FROM partenaires WHERE id = $1', [id]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'Partenaire introuvable' });
        return res.json(r.rows[0]);
      }
      values.push(id);
      const result = await query(
        `UPDATE partenaires SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
        values
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Partenaire introuvable' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

exports.remove = async (req, res) => {
  try {
    const result = await query('DELETE FROM partenaires WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Partenaire introuvable' });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Fichier image requis' });
    const url = `/uploads/partenaires/${req.file.filename}`;
    await query('UPDATE partenaires SET logo_url = $1 WHERE id = $2', [url, req.params.id]);
    const result = await query('SELECT * FROM partenaires WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Partenaire introuvable' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
