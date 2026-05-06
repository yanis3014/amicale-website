const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');
const { listMemberCertificates } = require('../services/certificateService');

const SALT_ROUNDS = 12;

function generateNumeroMembre(year, id) {
  return `FPHM-${year}-${String(id).padStart(4, '0')}`;
}

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

exports.getMyCertificates = async (req, res) => {
  try {
    const rows = await listMemberCertificates(req.user.id);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Admin: create a member (traced via created_by_admin_id and audit)
exports.createMember = [
  body('nom').trim().notEmpty().withMessage('Nom requis'),
  body('prenom').trim().notEmpty().withMessage('Prénom requis'),
  body('email').trim().isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 8 }).withMessage('Mot de passe min 8 caractères'),
  body('annee').isInt({ min: 1, max: 6 }).withMessage('Année requise (1-6)'),
  body('telephone').trim().notEmpty().withMessage('Téléphone requis'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { nom, prenom, email, password, annee, telephone } = req.body;
      const adminId = req.user.id;

      const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
      const year = new Date().getFullYear();
      const result = await query(
        `INSERT INTO users (nom, prenom, email, password_hash, annee, telephone, role, created_by_admin_id)
         VALUES ($1, $2, $3, $4, $5, $6, 'member', $7)
         RETURNING id, nom, prenom, email, role, annee, telephone, numero_membre, is_adherent, adherent_expires_at, created_at, created_by_admin_id`,
        [nom, prenom, email, password_hash, annee, telephone, adminId]
      );
      const user = result.rows[0];
      const numero_membre = generateNumeroMembre(year, user.id);
      await query('UPDATE users SET numero_membre = $1 WHERE id = $2', [numero_membre, user.id]);
      user.numero_membre = numero_membre;
      delete user.created_by_admin_id;
      return res.status(201).json(user);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

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
  body('nom').trim().notEmpty().withMessage('Nom requis'),
  body('prenom').trim().notEmpty().withMessage('Prénom requis'),
  body('email').trim().isEmail().withMessage('Email invalide'),
  body('annee').isInt({ min: 1, max: 6 }).withMessage('Année requise (1-6)'),
  body('telephone').trim().notEmpty().withMessage('Téléphone requis'),
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
