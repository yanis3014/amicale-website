const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');

/**
 * Valide un coupon et retourne la réduction à appliquer (montant après réduction ou null si invalide).
 * @param {string} code - Code du coupon
 * @param {string} typeCoupon - 'adhesion' ou 'event'
 * @param {number} [eventId] - Obligatoire si typeCoupon === 'event'
 * @param {number} montantInitial - Montant avant réduction
 * @returns {{ montantFinal: number, coupon_id: number } | { error: string }}
 */
async function validateAndApplyCoupon(code, typeCoupon, eventId, montantInitial) {
  if (!code || !code.trim()) return { montantFinal: montantInitial, coupon_id: null };
  const c = code.trim().toUpperCase();
  const result = await query(
    `SELECT id, type_coupon, discount_type, discount_value, event_id, use_count, max_uses, is_active, valid_until, created_by_admin_id
     FROM coupons WHERE UPPER(code) = $1`,
    [c]
  );
  if (result.rows.length === 0) return { error: 'Coupon invalide' };
  const coupon = result.rows[0];
  if (!coupon.is_active) return { error: 'Ce coupon n\'est plus actif' };
  if (coupon.type_coupon !== typeCoupon) return { error: 'Ce coupon ne s\'applique pas à cette action' };
  if (typeCoupon === 'event' && Number(coupon.event_id) !== Number(eventId)) return { error: 'Ce coupon ne s\'applique pas à cet événement' };
  if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) return { error: 'Ce coupon a expiré' };
  if (coupon.max_uses != null && coupon.use_count >= coupon.max_uses) return { error: 'Ce coupon a atteint son nombre d\'utilisations maximum' };

  let montantFinal = Number(montantInitial);
  if (coupon.discount_type === 'percent') {
    montantFinal = Math.max(0, montantFinal - (montantFinal * Number(coupon.discount_value)) / 100);
  } else {
    montantFinal = Math.max(0, montantFinal - Number(coupon.discount_value));
  }
  return { montantFinal, coupon_id: coupon.id };
}

async function incrementCouponUse(couponId) {
  await query('UPDATE coupons SET use_count = use_count + 1 WHERE id = $1', [couponId]);
}

exports.validateAndApplyCoupon = validateAndApplyCoupon;
exports.incrementCouponUse = incrementCouponUse;

// Admin: list all coupons
exports.listAdmin = async (req, res) => {
  try {
    const result = await query(
      `SELECT c.*, u.admin_identifier AS created_by_identifier, u.nom AS created_by_nom, u.prenom AS created_by_prenom
       FROM coupons c
       LEFT JOIN users u ON u.id = c.created_by_admin_id
       ORDER BY c.created_at DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Admin: create coupon
exports.create = [
  body('code').trim().notEmpty().withMessage('Code requis'),
  body('type_coupon').isIn(['adhesion', 'event']).withMessage('Type invalide'),
  body('discount_type').isIn(['percent', 'fixed']).withMessage('Type de réduction invalide'),
  body('discount_value').isFloat({ min: 0.01 }).withMessage('Valeur de réduction invalide'),
  body('event_id').optional().isInt().withMessage('event_id invalide'),
  body('valid_until').optional(),
  body('max_uses').optional().isInt({ min: 1 }),
  body('is_active').optional().isBoolean(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { code, type_coupon, discount_type, discount_value, event_id, valid_until, max_uses, is_active } = req.body;
      const created_by_admin_id = req.user.id;

      if (type_coupon === 'event' && !event_id) {
        return res.status(400).json({ error: 'Un coupon événement doit être lié à un événement' });
      }
      if (type_coupon === 'adhesion' && event_id) {
        return res.status(400).json({ error: 'Un coupon adhésion ne doit pas avoir d\'événement' });
      }

      const normalizedCode = code.trim().toUpperCase();
      const existing = await query('SELECT id FROM coupons WHERE UPPER(code) = $1', [normalizedCode]);
      if (existing.rows.length > 0) return res.status(400).json({ error: 'Ce code de coupon existe déjà' });

      const result = await query(
        `INSERT INTO coupons (code, type_coupon, discount_type, discount_value, event_id, created_by_admin_id, valid_until, max_uses, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          normalizedCode,
          type_coupon,
          discount_type,
          discount_value,
          type_coupon === 'event' ? event_id : null,
          created_by_admin_id,
          valid_until || null,
          max_uses || null,
          is_active !== false,
        ]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

// Admin: update coupon (is_active, valid_until, max_uses)
exports.update = [
  body('is_active').optional().isBoolean(),
  body('valid_until').optional(),
  body('max_uses').optional().isInt({ min: 0 }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const id = req.params.id;
      const updates = [];
      const values = [];
      let i = 1;
      if (req.body.is_active !== undefined) {
        updates.push(`is_active = $${i}`);
        values.push(req.body.is_active);
        i++;
      }
      if (req.body.valid_until !== undefined) {
        updates.push(`valid_until = $${i}`);
        values.push(req.body.valid_until || null);
        i++;
      }
      if (req.body.max_uses !== undefined) {
        updates.push(`max_uses = $${i}`);
        values.push(req.body.max_uses);
        i++;
      }
      if (updates.length === 0) {
        const r = await query('SELECT * FROM coupons WHERE id = $1', [id]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'Coupon introuvable' });
        return res.json(r.rows[0]);
      }
      values.push(id);
      const result = await query(
        `UPDATE coupons SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
        values
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Coupon introuvable' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

// Admin: delete coupon
exports.remove = async (req, res) => {
  try {
    const result = await query('DELETE FROM coupons WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Coupon introuvable' });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
