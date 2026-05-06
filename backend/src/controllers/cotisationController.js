const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');
const { generateCotisationCertificate } = require('../services/certificateService');

exports.submit = [
  body('montant').isFloat({ min: 0 }).withMessage('Montant invalide'),
  body('annee_universitaire').trim().notEmpty().withMessage('Année universitaire requise'),
  body('methode_paiement').trim().notEmpty().withMessage('Méthode de paiement requise'),
  body('reference').trim().notEmpty().withMessage('Référence requise'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { annee_universitaire, methode_paiement, reference } = req.body;
      // Le montant est piloté par la configuration admin (clé: adhesion_fee_amount), fallback à 30 DT.
      const settingRes = await query('SELECT value FROM page_settings WHERE key = $1', ['adhesion_fee_amount']);
      const configuredAmount = Number(settingRes.rows[0]?.value);
      const montantFinal = Number.isFinite(configuredAmount) && configuredAmount > 0 ? configuredAmount : 30;
      const yearMatch = annee_universitaire.match(/(\d{4})/);
      const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
      const expiresAt = new Date(year + 1, 8, 30);
      const result = await query(
        `INSERT INTO cotisations (user_id, montant, annee_universitaire, methode_paiement, reference, statut, confirmed_by, confirmed_at)
         VALUES ($1, $2, $3, $4, $5, 'confirmed', $1, NOW()) RETURNING *`,
        [req.user.id, montantFinal, annee_universitaire, methode_paiement, reference]
      );
      await query(
        'UPDATE users SET is_adherent = true, adherent_expires_at = $1 WHERE id = $2',
        [expiresAt, req.user.id]
      );
      const userResult = await query('SELECT id, nom, prenom, email FROM users WHERE id = $1', [req.user.id]);
      const user = userResult.rows[0];
      if (user) {
        generateCotisationCertificate({
          user,
          cotisation: result.rows[0],
        }).catch((e) => console.error('Generation certificat cotisation:', e));
      }
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
    const userResult = await query('SELECT id, nom, prenom, email FROM users WHERE id = $1', [user_id]);
    const user = userResult.rows[0];
    if (user) {
      generateCotisationCertificate({
        user,
        cotisation: result.rows[0],
      }).catch((e) => console.error('Generation certificat cotisation:', e));
    }
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
