require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./src/routes/authRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const activityRoutes = require('./src/routes/activityRoutes');
const enseignantRoutes = require('./src/routes/enseignantRoutes');
const memberRoutes = require('./src/routes/memberRoutes');
const cotisationRoutes = require('./src/routes/cotisationRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Create upload directories on startup
const uploadDirs = ['./uploads', './uploads/events', './uploads/activities', './uploads/enseignants'];
uploadDirs.forEach((dir) => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

// Middlewares
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Amicale FPHM API' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/enseignants', enseignantRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/cotisations', cotisationRoutes);
app.use('/api/admin', adminRoutes);

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
