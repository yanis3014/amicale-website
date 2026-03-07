const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');

exports.submit = [
  body('montant').isFloat({ min: 0 }).withMessage('Montant invalide'),
  body('annee_universitaire').trim().notEmpty().withMessage('Année universitaire requise'),
  body('methode_paiement').optional().trim(),
  body('reference').optional().trim(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { montant, annee_universitaire, methode_paiement, reference } = req.body;
      const result = await query(
        `INSERT INTO cotisations (user_id, montant, annee_universitaire, methode_paiement, reference, statut)
         VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
        [req.user.id, montant, annee_universitaire, methode_paiement || null, reference || null]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

exports.listAdmin = async (req, res) => {
  try {
    const { statut } = req.query;
    let sql = `
      SELECT c.*, u.nom, u.prenom, u.email, u.numero_membre
      FROM cotisations c
      JOIN users u ON u.id = c.user_id
      WHERE 1=1
    `;
    const params = [];
    if (statut && ['pending', 'confirmed', 'rejected'].includes(statut)) {
      sql += ` AND c.statut = $1`;
      params.push(statut);
    }
    sql += ` ORDER BY c.created_at DESC`;
    const result = await query(sql, params);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.confirm = async (req, res) => {
  try {
    const id = req.params.id;
    const cot = await query('SELECT * FROM cotisations WHERE id = $1 AND statut = \'pending\'', [id]);
    if (cot.rows.length === 0) return res.status(404).json({ error: 'Cotisation introuvable ou déjà traitée' });
    const user_id = cot.rows[0].user_id;
    const yearMatch = cot.rows[0].annee_universitaire.match(/(\d{4})/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
    const expiresAt = new Date(year + 1, 8, 30);
    await query(
      'UPDATE cotisations SET statut = \'confirmed\', confirmed_by = $1, confirmed_at = NOW() WHERE id = $2',
      [req.user.id, id]
    );
    await query(
      'UPDATE users SET is_adherent = true, adherent_expires_at = $1 WHERE id = $2',
      [expiresAt, user_id]
    );
    const result = await query('SELECT * FROM cotisations WHERE id = $1', [id]);
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.reject = async (req, res) => {
  try {
    const result = await query(
      'UPDATE cotisations SET statut = \'rejected\', confirmed_by = $1, confirmed_at = NOW() WHERE id = $2 AND statut = \'pending\' RETURNING *',
      [req.user.id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Cotisation introuvable ou déjà traitée' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
