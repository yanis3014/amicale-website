const { query } = require('../config/db');

const ALLOWED_KEYS = [
  'enseignants_header_image',
  'mot_du_president',
  'presentation',
  'historique',
  'missions_visions',
  'valeurs',
  'documents',
  'mot_du_president_image',
  'presentation_image',
  'historique_image',
  'missions_visions_image',
  'valeurs_image',
  'documents_image',
  // Page d'accueil
  'home_banderole',
  'home_video_url',
  'home_annee_universitaire',
  'home_hero_image',
  'home_hero_text',
  'home_hero_title',
  'home_members_count_text',
];

const A_PROPOS_PAGE_KEYS = [
  'mot_du_president',
  'presentation',
  'historique',
  'missions_visions',
  'valeurs',
  'documents',
];

exports.get = async (req, res) => {
  try {
    const { key } = req.params;
    if (!ALLOWED_KEYS.includes(key)) {
      return res.status(400).json({ error: 'Clé non autorisée' });
    }
    const result = await query('SELECT value FROM page_settings WHERE key = $1', [key]);
    const value = result.rows.length > 0 ? result.rows[0].value : null;
    return res.json({ key, value });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.set = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    if (!ALLOWED_KEYS.includes(key)) {
      return res.status(400).json({ error: 'Clé non autorisée' });
    }
    await query(
      `INSERT INTO page_settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = $2`,
      [key, value == null ? '' : String(value)]
    );
    return res.json({ key, value: value == null ? '' : String(value) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.uploadEnseignantsHeader = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Fichier image requis' });
    const url = `/uploads/pages/${req.file.filename}`;
    const key = 'enseignants_header_image';
    await query(
      `INSERT INTO page_settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = $2`,
      [key, url]
    );
    return res.json({ key, value: url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.uploadAProposImage = async (req, res) => {
  try {
    const { pageKey } = req.params;
    if (!A_PROPOS_PAGE_KEYS.includes(pageKey)) {
      return res.status(400).json({ error: 'Page non autorisée' });
    }
    if (!req.file) return res.status(400).json({ error: 'Fichier image requis' });
    const url = `/uploads/pages/${req.file.filename}`;
    const key = `${pageKey}_image`;
    await query(
      `INSERT INTO page_settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = $2`,
      [key, url]
    );
    return res.json({ key, value: url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.uploadHomeHeroImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Fichier image requis' });
    const url = `/uploads/pages/${req.file.filename}`;
    const key = 'home_hero_image';
    await query(
      `INSERT INTO page_settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = $2`,
      [key, url]
    );
    return res.json({ key, value: url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
