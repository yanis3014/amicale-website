/**
 * Crée les 9 comptes opérateurs (OP01 à OP09) avec identifiants distincts.
 * Usage: node scripts/create-operateurs.js
 * Chaque compte a : email op01@fphm.tn .. op09@fphm.tn, mot de passe Op2026! (à changer)
 * et admin_identifier = OP01 .. OP09, numero_membre = OP-001 .. OP-009.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const { query, pool } = require('../src/config/db');

const SALT_ROUNDS = 12;
const DEFAULT_PASSWORD = 'Op2026!';

const operateurs = [
  { id: 'OP01', email: 'op01@fphm.tn', nom: 'Opérateur', prenom: '01' },
  { id: 'OP02', email: 'op02@fphm.tn', nom: 'Opérateur', prenom: '02' },
  { id: 'OP03', email: 'op03@fphm.tn', nom: 'Opérateur', prenom: '03' },
  { id: 'OP04', email: 'op04@fphm.tn', nom: 'Opérateur', prenom: '04' },
  { id: 'OP05', email: 'op05@fphm.tn', nom: 'Opérateur', prenom: '05' },
  { id: 'OP06', email: 'op06@fphm.tn', nom: 'Opérateur', prenom: '06' },
  { id: 'OP07', email: 'op07@fphm.tn', nom: 'Opérateur', prenom: '07' },
  { id: 'OP08', email: 'op08@fphm.tn', nom: 'Opérateur', prenom: '08' },
  { id: 'OP09', email: 'op09@fphm.tn', nom: 'Opérateur', prenom: '09' },
];

async function main() {
  try {
    const password_hash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);
    for (const op of operateurs) {
      const numero_membre = `OP-${op.id.slice(-2)}`; // OP-01 .. OP-09
      const existing = await query('SELECT id, role, admin_identifier FROM users WHERE email = $1', [op.email]);
      if (existing.rows.length > 0) {
        await query(
          `UPDATE users SET role = 'admin', admin_identifier = $1, numero_membre = $2, nom = $3, prenom = $4, password_hash = $5 WHERE id = $6`,
          [op.id, numero_membre, op.nom, op.prenom, password_hash, existing.rows[0].id]
        );
        console.log(`Compte existant mis à jour: ${op.email} (${op.id})`);
      } else {
        await query(
          `INSERT INTO users (nom, prenom, email, password_hash, role, numero_membre, admin_identifier)
           VALUES ($1, $2, $3, $4, 'admin', $5, $6)`,
          [op.nom, op.prenom, op.email, password_hash, numero_membre, op.id]
        );
        console.log(`Créé: ${op.email} (${op.id}) — mot de passe: ${DEFAULT_PASSWORD}`);
      }
    }
    console.log('\nLes 9 comptes opérateurs sont prêts. Pensez à changer les mots de passe en production.');
  } catch (err) {
    console.error('Erreur:', err.message);
    process.exit(1);
  } finally {
    if (pool && typeof pool.end === 'function') pool.end();
  }
}

main();
