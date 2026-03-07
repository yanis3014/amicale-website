const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');

exports.getMyProfile = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, nom, prenom, email, role, annee, telephone, numero_membre, is_adherent, adherent_expires_at, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Utilisateur introuvable' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getMyEvents = async (req, res) => {
  try {
    const result = await query(
      `SELECT r.*, e.titre, e.date, e.lieu, e.image_url
       FROM registrations r
       JOIN events e ON e.id = r.event_id
       WHERE r.user_id = $1
       ORDER BY e.date DESC`,
      [req.user.id]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Admin: list all members
exports.listAdmin = async (req, res) => {
  try {
    const { search, is_adherent } = req.query;
    let sql = `SELECT id, nom, prenom, email, role, annee, telephone, numero_membre, is_adherent, adherent_expires_at, created_at FROM users WHERE role != 'admin'`;
    const params = [];
    let i = 1;
    if (search) {
      sql += ` AND (nom ILIKE $${i} OR prenom ILIKE $${i} OR email ILIKE $${i})`;
      params.push(`%${search}%`);
      i++;
    }
    if (is_adherent === 'true') sql += ` AND is_adherent = true`;
    if (is_adherent === 'false') sql += ` AND is_adherent = false`;
    sql += ` ORDER BY nom, prenom`;
    const result = await query(sql, params);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getByIdAdmin = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, nom, prenom, email, role, annee, telephone, numero_membre, is_adherent, adherent_expires_at, created_at FROM users WHERE id = $1 AND role != \'admin\'',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Membre introuvable' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.updateAdmin = [
  body('nom').optional().trim().notEmpty(),
  body('prenom').optional().trim().notEmpty(),
  body('email').optional().trim().isEmail(),
  body('annee').optional().isInt({ min: 1, max: 6 }),
  body('telephone').optional().trim(),
  body('is_adherent').optional().isBoolean(),
  body('adherent_expires_at').optional(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const id = req.params.id;
      const fields = ['nom', 'prenom', 'email', 'annee', 'telephone', 'is_adherent', 'adherent_expires_at'];
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
        const r = await query('SELECT id, nom, prenom, email, role, annee, telephone, numero_membre, is_adherent, adherent_expires_at FROM users WHERE id = $1', [id]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'Membre introuvable' });
        return res.json(r.rows[0]);
      }
      values.push(id);
      const result = await query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${i} AND role != 'admin' RETURNING id, nom, prenom, email, role, annee, telephone, numero_membre, is_adherent, adherent_expires_at`,
        values
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Membre introuvable' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

exports.removeAdmin = async (req, res) => {
  try {
    const result = await query('DELETE FROM users WHERE id = $1 AND role != \'admin\' RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Membre introuvable' });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
