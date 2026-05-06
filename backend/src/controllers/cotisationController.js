const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');
const { generateCotisationCertificate } = require('../services/certificateService');

exports.listAdmin = async (_req, res) => {
  try {
    const result = await query(
      `SELECT
         c.*,
         u.nom,
         u.prenom,
         u.email
       FROM cotisations c
       LEFT JOIN users u ON u.id = c.user_id
       ORDER BY c.created_at DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('[cotisationController.listAdmin]', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

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

