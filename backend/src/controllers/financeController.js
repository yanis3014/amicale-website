const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');

/**
 * Vue d'ensemble : totaux par source (cotisations, événements, entrées manuelles) + détail récent
 */
exports.overview = async (req, res) => {
  try {
    const [cotisationsSum, registrationsSum, entriesSum, entriesList, cotisationsCount, registrationsCount] = await Promise.all([
      query(
        `SELECT COALESCE(SUM(montant), 0) AS total FROM cotisations WHERE statut = 'confirmed'`
      ),
      query(
        `SELECT COALESCE(SUM(montant_paye), 0) AS total FROM registrations WHERE statut = 'confirmed' AND montant_paye IS NOT NULL`
      ),
      query(
        `SELECT COALESCE(SUM(montant), 0) AS total FROM finance_entries`
      ),
      query(
        `SELECT fe.id, fe.montant, fe.libelle, fe.type_entree, fe.date_entree, fe.created_at,
                u.nom AS created_by_nom, u.prenom AS created_by_prenom, u.admin_identifier AS created_by_identifier
         FROM finance_entries fe
         JOIN users u ON u.id = fe.created_by
         ORDER BY fe.date_entree DESC, fe.created_at DESC
         LIMIT 100`
      ),
      query(`SELECT COUNT(*) AS c FROM cotisations WHERE statut = 'confirmed'`),
      query(`SELECT COUNT(*) AS c FROM registrations WHERE statut = 'confirmed' AND montant_paye IS NOT NULL AND montant_paye > 0`),
    ]);

    const revenus_cotisations = parseFloat(cotisationsSum.rows[0]?.total || 0);
    const revenus_events = parseFloat(registrationsSum.rows[0]?.total || 0);
    const revenus_manuels = parseFloat(entriesSum.rows[0]?.total || 0);
    const total = revenus_cotisations + revenus_events + revenus_manuels;

    return res.json({
      revenus_cotisations,
      revenus_events,
      revenus_manuels,
      total,
      nb_cotisations: parseInt(cotisationsCount.rows[0]?.c || 0, 10),
      nb_inscriptions_payantes: parseInt(registrationsCount.rows[0]?.c || 0, 10),
      entrees_manuelles: entriesList.rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

/**
 * Liste des entrées manuelles (pour détail / pagination si besoin)
 */
exports.listEntries = async (req, res) => {
  try {
    const { type_entree, limit = '100', offset = '0' } = req.query;
    const lim = Math.min(parseInt(limit, 10) || 100, 200);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    let sql = `
      SELECT fe.id, fe.montant, fe.libelle, fe.type_entree, fe.date_entree, fe.created_at,
             u.nom AS created_by_nom, u.prenom AS created_by_prenom, u.email AS created_by_email, u.admin_identifier AS created_by_identifier
      FROM finance_entries fe
      JOIN users u ON u.id = fe.created_by
      WHERE 1=1
    `;
    const params = [];
    let i = 1;
    if (type_entree && ['sponsor', 'don', 'autre'].includes(type_entree)) {
      sql += ` AND fe.type_entree = $${i}`;
      params.push(type_entree);
      i++;
    }
    sql += ` ORDER BY fe.date_entree DESC, fe.created_at DESC LIMIT $${i} OFFSET $${i + 1}`;
    params.push(lim, off);

    const result = await query(sql, params);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createEntry = [
  body('montant').isFloat({ min: 0.01 }).withMessage('Montant invalide'),
  body('libelle').trim().notEmpty().withMessage('Libellé requis'),
  body('type_entree').isIn(['sponsor', 'don', 'autre']).withMessage('Type invalide'),
  body('date_entree').isISO8601().withMessage('Date invalide'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { montant, libelle, type_entree, date_entree } = req.body;
      const date = new Date(date_entree).toISOString().slice(0, 10);
      const result = await query(
        `INSERT INTO finance_entries (montant, libelle, type_entree, date_entree, created_by)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [montant, libelle, type_entree, date, req.user.id]
      );
      const row = result.rows[0];
      const userRow = await query('SELECT nom, prenom, admin_identifier FROM users WHERE id = $1', [req.user.id]);
      const u = userRow.rows[0];
      return res.status(201).json({
        ...row,
        created_by_nom: u?.nom,
        created_by_prenom: u?.prenom,
        created_by_identifier: u?.admin_identifier,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

exports.updateEntry = [
  body('montant').optional().isFloat({ min: 0.01 }),
  body('libelle').optional().trim().notEmpty(),
  body('type_entree').optional().isIn(['sponsor', 'don', 'autre']),
  body('date_entree').optional().isISO8601(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const id = req.params.id;
      const updates = [];
      const values = [];
      let i = 1;
      ['montant', 'libelle', 'type_entree', 'date_entree'].forEach((f) => {
        if (req.body[f] !== undefined) {
          if (f === 'date_entree') {
            updates.push(`${f} = $${i}`);
            values.push(new Date(req.body[f]).toISOString().slice(0, 10));
          } else {
            updates.push(`${f} = $${i}`);
            values.push(req.body[f]);
          }
          i++;
        }
      });
      if (updates.length === 0) {
        const r = await query('SELECT * FROM finance_entries WHERE id = $1', [id]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'Entrée introuvable' });
        return res.json(r.rows[0]);
      }
      values.push(id);
      const result = await query(
        `UPDATE finance_entries SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
        values
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Entrée introuvable' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

exports.deleteEntry = async (req, res) => {
  try {
    const result = await query('DELETE FROM finance_entries WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Entrée introuvable' });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
