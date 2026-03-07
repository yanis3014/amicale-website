require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'amicale',
  user: 'postgres',
  password: 'my404796',
});

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