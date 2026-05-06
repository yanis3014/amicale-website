require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const { csrfMiddleware } = require('./src/middleware/csrfMiddleware');

const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const activityRoutes = require('./src/routes/activityRoutes');
const enseignantRoutes = require('./src/routes/enseignantRoutes');
const memberRoutes = require('./src/routes/memberRoutes');
const cotisationRoutes = require('./src/routes/cotisationRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const settingsRoutes = require('./src/routes/settingsRoutes');
const partenaireRoutes = require('./src/routes/partenaireRoutes');
const avantageRoutes = require('./src/routes/avantageRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

/**
 * Derriere reverse proxy : X-Forwarded-* et IP client fiables (rate limiting, logs).
 * Render envoie X-Forwarded-For ; sans cela express-rate-limit leve une erreur → 500 sur /login.
 */
const trustProxyEnv =
  process.env.TRUST_PROXY === '1' ||
  process.env.TRUST_PROXY === 'true' ||
  process.env.RENDER === 'true';
if (trustProxyEnv) {
  app.set('trust proxy', 1);
}

const FRONTEND_URL_SINGLE = process.env.FRONTEND_URL || 'http://localhost:3000';
/** Plusieurs origines autorisees pour CORS (ex. https://www.site.fr,https://site.fr). */
const ALLOWED_ORIGINS = (process.env.FRONTEND_ORIGINS || FRONTEND_URL_SINGLE)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// Create upload directories on startup
const uploadDirs = ['./uploads', './uploads/events', './uploads/activities', './uploads/enseignants', './uploads/pages', './uploads/pages/documents', './uploads/partenaires', './uploads/certificates', './uploads/certificates/templates'];
uploadDirs.forEach((dir) => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

// Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}));
app.use(cookieParser());
app.use(express.json());
app.use(csrfMiddleware);
app.use(morgan('dev'));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const { pool } = require('./src/config/db');

// Health check (sans DB)
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Amicale FPHM API' });
});

// Smoke test PostgreSQL (diagnostic Render : 503 si DATABASE_URL / TLS / droits KO)
app.get('/api/health/db', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.json({ ok: true, db: true });
  } catch (err) {
    console.error('[health/db]', err.message, err.code || '');
    const detail = process.env.NODE_ENV !== 'production' ? err.message : undefined;
    return res.status(503).json({ ok: false, db: false, detail });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/enseignants', enseignantRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/cotisations', cotisationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/partenaires', partenaireRoutes);
app.use('/api/avantages', avantageRoutes);

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler global
app.use((err, req, res, next) => {
  if (err && err.name === 'MulterError') {
    return res.status(400).json({ error: `Erreur upload: ${err.message}` });
  }
  if (err && /fichier|upload|pdf|image/i.test(err.message || '')) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
