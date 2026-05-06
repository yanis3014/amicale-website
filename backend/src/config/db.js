require('dotenv').config();
const { Pool } = require('pg');

// PostgreSQL : Supabase (DATABASE_URL — session mode 5432 ou pooler 6543) ou variables DB_* en local
function sslForDatabaseUrl(url) {
  if (!url) return false;
  const u = url.toLowerCase();
  if (u.includes('localhost') || u.includes('127.0.0.1')) return false;

  const relaxTls =
    process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false' ||
    process.env.DB_SSL_REJECT_UNAUTHORIZED === '0';
  if (relaxTls) {
    return { rejectUnauthorized: false };
  }

  const ca = process.env.DB_SSL_CA?.trim();
  if (ca) {
    return { rejectUnauthorized: true, ca: ca.replace(/\\n/g, '\n') };
  }

  // Neon / Supabase pooler / Postgres managé Render : Node peut refuser la chaîne sans CA dédiée.
  // En prod stricte, utiliser DB_SSL_CA ; ou DB_SSL_REJECT_UNAUTHORIZED=false explicitement.
  if (/supabase\.co|neon\.tech|pooler|\.render\.com/i.test(url)) {
    return { rejectUnauthorized: false };
  }

  return { rejectUnauthorized: true };
}

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: sslForDatabaseUrl(process.env.DATABASE_URL),
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      database: process.env.DB_NAME || 'amicale',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
    };

const pool = new Pool(poolConfig);

pool.connect((err) => {
  if (err) {
    console.error('Erreur connexion PostgreSQL:', err.message);
  } else {
    console.log('PostgreSQL connecté avec succès');
  }
});

function query(text, params) {
  return pool.query(text, params);
}

module.exports = { query, pool };
