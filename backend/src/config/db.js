require('dotenv').config();
const { Pool } = require('pg');

// Render et Heroku fournissent DATABASE_URL ; en local on peut utiliser DB_*
const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false }
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
