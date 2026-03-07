/**
 * Script pour créer un compte administrateur.
 * Usage: node scripts/create-admin.js
 * Variables d'environnement optionnelles (ou .env):
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NOM, ADMIN_PRENOM
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const { query, pool } = require('../src/config/db');

const SALT_ROUNDS = 12;

const email = process.env.ADMIN_EMAIL || 'admin@fphm.tn';
const password = process.env.ADMIN_PASSWORD || 'Admin2026!';
const nom = process.env.ADMIN_NOM || 'Admin';
const prenom = process.env.ADMIN_PRENOM || 'FPHM';

async function main() {
  try {
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log('Un utilisateur avec cet email existe déjà:', email);
      const u = existing.rows[0];
      await query(
        "UPDATE users SET role = 'admin' WHERE id = $1 RETURNING id",
        [u.id]
      );
      console.log('Son rôle a été mis à jour en "admin".');
      process.exit(0);
      return;
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    await query(
      `INSERT INTO users (nom, prenom, email, password_hash, role, numero_membre)
       VALUES ($1, $2, $3, $4, 'admin', 'ADMIN-001')`,
      [nom, prenom, email, password_hash]
    );
    console.log('Compte admin créé avec succès.');
    console.log('  Email:', email);
    console.log('  Mot de passe:', password);
    console.log('\nConnectez-vous sur le site avec ces identifiants, puis allez sur /admin');
  } catch (err) {
    console.error('Erreur:', err.message);
    process.exit(1);
  } finally {
    if (pool && typeof pool.end === 'function') pool.end();
  }
}

main();
