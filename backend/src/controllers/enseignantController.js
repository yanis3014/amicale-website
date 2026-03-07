const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');

exports.list = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM enseignants WHERE is_active = true ORDER BY ordre ASC, nom ASC'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Admin: tous les enseignants (actifs + inactifs)
exports.listAll = async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM enseignants ORDER BY ordre ASC, nom ASC'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await query('SELECT * FROM enseignants WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Enseignant introuvable' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.create = [
  body('nom').trim().notEmpty().withMessage('Nom requis'),
  body('titre').optional().trim(),
  body('specialite').optional().trim(),
  body('email').optional().trim().isEmail(),
  body('linkedin').optional().trim(),
  body('ordre').optional().isInt({ min: 0 }),
  body('is_active').optional().isBoolean(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { nom, titre, specialite, email, linkedin, ordre = 0, is_active = true } = req.body;
      const result = await query(
        `INSERT INTO enseignants (nom, titre, specialite, email, linkedin, ordre, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [nom, titre || null, specialite || null, email || null, linkedin || null, ordre, is_active]
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
  body('titre').optional().trim(),
  body('specialite').optional().trim(),
  body('email').optional().trim().isEmail(),
  body('linkedin').optional().trim(),
  body('ordre').optional().isInt({ min: 0 }),
  body('is_active').optional().isBoolean(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const id = req.params.id;
      const fields = ['nom', 'titre', 'specialite', 'email', 'linkedin', 'ordre', 'is_active'];
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
      if (updates.length === 0) {
        const r = await query('SELECT * FROM enseignants WHERE id = $1', [id]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'Enseignant introuvable' });
        return res.json(r.rows[0]);
      }
      values.push(id);
      const result = await query(
        `UPDATE enseignants SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
        values
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Enseignant introuvable' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

exports.remove = async (req, res) => {
  try {
    const result = await query('DELETE FROM enseignants WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Enseignant introuvable' });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.reorder = [
  body('ordre').isInt({ min: 0 }).withMessage('Ordre requis'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const result = await query(
        'UPDATE enseignants SET ordre = $1 WHERE id = $2 RETURNING *',
        [req.body.ordre, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Enseignant introuvable' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

exports.uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Fichier image requis' });
    const url = `/uploads/enseignants/${req.file.filename}`;
    await query('UPDATE enseignants SET photo_url = $1 WHERE id = $2', [url, req.params.id]);
    const result = await query('SELECT id, photo_url FROM enseignants WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Enseignant introuvable' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
