/**
 * Crée la table avantages si elle n'existe pas.
 * Usage: node scripts/run-migration-avantages.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { pool } = require('../src/config/db');
const fs = require('fs');
const path = require('path');

const migrationPath = path.join(__dirname, '..', 'src', 'config', 'migration-avantages.sql');

async function main() {
  const sql = fs.readFileSync(migrationPath, 'utf8');
  try {
    await pool.query(sql);
    console.log('Migration avantages exécutée. Table avantages prête.');
  } catch (err) {
    console.error('Erreur:', err.message);
    process.exit(1);
  } finally {
    if (pool && typeof pool.end === 'function') pool.end();
  }
}

main();
