const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou invalide' });
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await query(
      'SELECT id, nom, prenom, email, role, annee, telephone, numero_membre, is_adherent, adherent_expires_at, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Utilisateur introuvable' });
    }
    req.user = result.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

async function optionalAuthMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await query(
      'SELECT id, nom, prenom, email, role, annee, telephone, numero_membre, is_adherent, adherent_expires_at, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );
    if (result.rows.length > 0) req.user = result.rows[0];
  } catch (_) {}
  next();
}

module.exports = { authMiddleware, optionalAuthMiddleware };
