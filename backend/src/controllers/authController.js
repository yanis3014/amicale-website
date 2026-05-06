const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');
const {
  getJwtSecret,
  getCookieOptions,
  getCsrfCookieOptions,
  jwtExpiresInToMs,
  getSessionCookieClearOptions,
} = require('../config/security');
const crypto = require('crypto');

const JWT_SECRET = getJwtSecret();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 12;
const AUTH_COOKIE_NAME = 'auth_token';
const CSRF_COOKIE_NAME = 'csrf_token';

function issueAuthCookies(res, token) {
  const maxAgeMs = jwtExpiresInToMs(JWT_EXPIRES_IN);
  res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions(maxAgeMs));
  const csrfToken = crypto.randomBytes(24).toString('hex');
  res.cookie(CSRF_COOKIE_NAME, csrfToken, getCsrfCookieOptions(maxAgeMs));
}

function sanitizeUser(row) {
  const u = { ...row };
  delete u.password_hash;
  return u;
}

function generateNumeroMembre(year, id) {
  return `FPHM-${year}-${String(id).padStart(4, '0')}`;
}

exports.register = [
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

      const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé' });
      }

      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
      const year = new Date().getFullYear();
      const result = await query(
        `INSERT INTO users (nom, prenom, email, password_hash, annee, telephone)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, nom, prenom, email, role, annee, telephone, numero_membre, is_adherent, adherent_expires_at, created_at`,
        [nom, prenom, email, password_hash, annee, telephone]
      );
      const user = result.rows[0];
      const numero_membre = generateNumeroMembre(year, user.id);
      await query('UPDATE users SET numero_membre = $1 WHERE id = $2', [numero_membre, user.id]);
      user.numero_membre = numero_membre;

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      issueAuthCookies(res, token);
      return res.status(201).json({ token, user: sanitizeUser(user) });
    } catch (err) {
      console.error(err);
      const message = process.env.NODE_ENV !== 'production' ? err.message : 'Erreur lors de l\'inscription';
      return res.status(500).json({ error: 'Erreur lors de l\'inscription', detail: message });
    }
  },
];

exports.login = [
  body('email').trim().isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;

      const result = await query(
        'SELECT id, nom, prenom, email, password_hash, role, annee, telephone, numero_membre, is_adherent, adherent_expires_at FROM users WHERE email = $1',
        [email]
      );
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }
      const user = result.rows[0];
      if (!user.password_hash) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      issueAuthCookies(res, token);
      return res.json({
        token,
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
          is_adherent: user.is_adherent,
          adherent_expires_at: user.adherent_expires_at,
          numero_membre: user.numero_membre,
        },
      });
    } catch (err) {
      console.error('[auth/login]', err.message, err.code || '', err.stack);
      return res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  },
];

exports.me = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, nom, prenom, email, role, annee, telephone, numero_membre, is_adherent, adherent_expires_at, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.logout = async (_req, res) => {
  const clr = getSessionCookieClearOptions();
  res.clearCookie(AUTH_COOKIE_NAME, clr);
  res.clearCookie(CSRF_COOKIE_NAME, clr);
  return res.status(204).send();
};

exports.changePassword = [
  body('current_password').notEmpty().withMessage('Mot de passe actuel requis'),
  body('new_password').isLength({ min: 8 }).withMessage('Nouveau mot de passe min 8 caractères'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { current_password, new_password } = req.body;

      const result = await query('SELECT password_hash FROM users WHERE id = $1', [req.user.id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Utilisateur introuvable' });
      }
      const valid = await bcrypt.compare(current_password, result.rows[0].password_hash);
      if (!valid) {
        return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
      }

      const password_hash = await bcrypt.hash(new_password, SALT_ROUNDS);
      await query('UPDATE users SET password_hash = $1 WHERE id = $2', [password_hash, req.user.id]);
      return res.json({ message: 'Mot de passe modifié' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];
