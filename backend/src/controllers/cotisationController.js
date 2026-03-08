const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');
const { validateAndApplyCoupon, incrementCouponUse } = require('./couponController');
const { logAction } = require('../services/auditService');

exports.submit = [
  body('montant').isFloat({ min: 0 }).withMessage('Montant invalide'),
  body('annee_universitaire').trim().notEmpty().withMessage('Année universitaire requise'),
  body('methode_paiement').optional().trim(),
  body('reference').optional().trim(),
  body('coupon_code').optional().trim(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { montant, annee_universitaire, methode_paiement, reference, coupon_code } = req.body;
      let montantFinal = Number(montant);
      let coupon_id = null;
      if (coupon_code) {
        const applied = await validateAndApplyCoupon(coupon_code, 'adhesion', null, montant);
        if (applied.error) return res.status(400).json({ error: applied.error });
        montantFinal = applied.montantFinal;
        coupon_id = applied.coupon_id;
      }
      const result = await query(
        `INSERT INTO cotisations (user_id, montant, annee_universitaire, methode_paiement, reference, statut, coupon_id)
         VALUES ($1, $2, $3, $4, $5, 'pending', $6) RETURNING *`,
        [req.user.id, montantFinal, annee_universitaire, methode_paiement || null, reference || null, coupon_id]
      );
      if (coupon_id) {
        await incrementCouponUse(coupon_id);
        const ip = req.ip || req.connection?.remoteAddress || req.headers?.['x-forwarded-for']?.split(',')[0]?.trim();
        logAction({
          user_id: req.user.id,
          user_email: req.user.email || null,
          admin_identifier: null,
          action: 'Utilisation coupon (adhésion)',
          method: 'POST',
          path: '/api/cotisations/submit',
          resource_type: 'coupons',
          resource_id: coupon_id,
          details: { body: { code: (coupon_code || '').trim().toUpperCase(), type: 'Adhésion' } },
          ip_address: ip || null,
        }).catch(() => {});
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
      SELECT c.*, u.nom, u.prenom, u.email, u.numero_membre,
             cp.code AS coupon_code, u_admin.admin_identifier AS coupon_created_by_admin
      FROM cotisations c
      JOIN users u ON u.id = c.user_id
      LEFT JOIN coupons cp ON cp.id = c.coupon_id
      LEFT JOIN users u_admin ON u_admin.id = cp.created_by_admin_id
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
