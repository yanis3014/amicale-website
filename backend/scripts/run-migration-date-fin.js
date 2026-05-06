/**
 * Ajoute la colonne date_fin à la table events.
 * Usage: node scripts/run-migration-date-fin.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL manquante dans .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const sql = `
ALTER TABLE events ADD COLUMN IF NOT EXISTS date_fin TIMESTAMP WITH TIME ZONE;
CREATE INDEX IF NOT EXISTS idx_events_date_fin ON events(date_fin);
`;

async function run() {
  try {
    await pool.query(sql);
    console.log('✓ Colonne date_fin ajoutée à la table events.');
  } catch (err) {
    console.error('Erreur:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
