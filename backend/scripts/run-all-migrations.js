/**
 * Exécute toutes les migrations SQL sur la base configurée via DATABASE_URL.
 * Usage: node scripts/run-all-migrations.js
 * Depuis le dossier backend, avec .env configuré.
 *
 * Base vide : exécute schema.sql puis les migrations.
 * Base existante : si schema.sql échoue (tables déjà là), exécute manuellement
 *   les fichiers migration-*.sql et migrations/*.sql.
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

const SKIP_SCHEMA = process.env.SKIP_SCHEMA === '1' || process.argv.includes('--skip-schema');

const MIGRATIONS = [
  ...(SKIP_SCHEMA ? [] : ['src/config/schema.sql']),
  'src/config/migration-audit-operateurs.sql',
  'src/config/migration-members-coupons.sql',
  'src/config/migration-page-settings-partenaires.sql',
  'src/config/migration-avantages.sql',
  'src/config/migration-finance-entries.sql',
  'src/config/migration-registration-payment-details.sql',
  'src/config/migration-events-date-fin.sql',
  'src/config/migration-events-featured.sql',
  'migrations/001_add_events_gallery.sql',
  'migrations/002_guest_registrations.sql',
];

async function run() {
  const client = await pool.connect();
  const baseDir = path.join(__dirname, '..');
  try {
    for (const file of MIGRATIONS) {
      const fullPath = path.join(baseDir, file);
      if (!fs.existsSync(fullPath)) {
        console.warn('  ⚠ Fichier non trouvé:', file);
        continue;
      }
      const sql = fs.readFileSync(fullPath, 'utf8');
      console.log('  →', file);
      await client.query(sql);
    }
    console.log('\n✓ Toutes les migrations ont été exécutées.');
  } catch (err) {
    console.error('\n✗ Erreur:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
