const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');

exports.list = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, libelle, type_avantage, ordre FROM avantages
       WHERE is_active = true
       ORDER BY ordre ASC, id ASC`
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
      `SELECT * FROM avantages ORDER BY ordre ASC, id ASC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.create = [
  body('libelle').trim().notEmpty().withMessage('Libellé requis'),
  body('type_avantage').optional().isIn(['avantage', 'reduction', 'autre']).withMessage('Type invalide'),
  body('ordre').optional().isInt({ min: 0 }),
  body('is_active').optional().isBoolean(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { libelle, type_avantage = 'avantage', ordre = 0, is_active = true } = req.body;
      const result = await query(
        `INSERT INTO avantages (libelle, type_avantage, ordre, is_active)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [libelle, type_avantage, ordre, is_active]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

exports.update = [
  body('libelle').optional().trim().notEmpty(),
  body('type_avantage').optional().isIn(['avantage', 'reduction', 'autre']),
  body('ordre').optional().isInt({ min: 0 }),
  body('is_active').optional().isBoolean(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const id = req.params.id;
      const { libelle, type_avantage, ordre, is_active } = req.body;
      const updates = [];
      const values = [];
      let i = 1;
      if (libelle !== undefined) { updates.push(`libelle = $${i++}`); values.push(libelle); }
      if (type_avantage !== undefined) { updates.push(`type_avantage = $${i++}`); values.push(type_avantage); }
      if (ordre !== undefined) { updates.push(`ordre = $${i++}`); values.push(ordre); }
      if (is_active !== undefined) { updates.push(`is_active = $${i++}`); values.push(is_active); }
      if (updates.length === 0) {
        const r = await query('SELECT * FROM avantages WHERE id = $1', [id]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'Avantage introuvable' });
        return res.json(r.rows[0]);
      }
      values.push(id);
      const result = await query(
        `UPDATE avantages SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
        values
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Avantage introuvable' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

exports.remove = async (req, res) => {
  try {
    const result = await query('DELETE FROM avantages WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Avantage introuvable' });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
