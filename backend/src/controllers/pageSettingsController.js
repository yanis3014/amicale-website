const { query } = require('../config/db');
const path = require('path');
const fs = require('fs');

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
  // Cotisation adhésion annuelle (DT)
  'adhesion_fee_amount',
  // Liste JSON des pièces administratives uploadées
  'documents_files',
  // Configuration template PDF certificats événements
  'certificate_event_template_pdf',
  'certificate_event_name_x',
  'certificate_event_name_y',
  'certificate_event_name_size',
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

exports.uploadCertificateTemplatePdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Fichier PDF requis' });
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Seuls les fichiers PDF sont autorisés' });
    }
    const url = `/uploads/certificates/templates/${req.file.filename}`;
    const key = 'certificate_event_template_pdf';
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

function parseDocumentsFiles(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

exports.uploadAdministrativeDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Fichier requis' });
    const titleInput = String(req.body?.title || '').trim();
    if (!titleInput) return res.status(400).json({ error: 'Titre requis' });
    const url = `/uploads/pages/documents/${req.file.filename}`;
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      title: titleInput,
      url,
      original_name: req.file.originalname,
      mime_type: req.file.mimetype || null,
      size: req.file.size || null,
      uploaded_at: new Date().toISOString(),
    };

    const currentRes = await query('SELECT value FROM page_settings WHERE key = $1', ['documents_files']);
    const currentList = parseDocumentsFiles(currentRes.rows[0]?.value);
    const nextList = [item, ...currentList];

    await query(
      `INSERT INTO page_settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = $2`,
      ['documents_files', JSON.stringify(nextList)]
    );

    return res.status(201).json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.listAdministrativeDocuments = async (_req, res) => {
  try {
    const result = await query('SELECT value FROM page_settings WHERE key = $1', ['documents_files']);
    return res.json(parseDocumentsFiles(result.rows[0]?.value));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteAdministrativeDocument = async (req, res) => {
  try {
    const { docId } = req.params;
    const result = await query('SELECT value FROM page_settings WHERE key = $1', ['documents_files']);
    const currentList = parseDocumentsFiles(result.rows[0]?.value);
    const toDelete = currentList.find((d) => d.id === docId);
    if (!toDelete) return res.status(404).json({ error: 'Document introuvable' });

    const nextList = currentList.filter((d) => d.id !== docId);
    await query(
      `INSERT INTO page_settings (key, value) VALUES ($1, $2)
       ON CONFLICT (key) DO UPDATE SET value = $2`,
      ['documents_files', JSON.stringify(nextList)]
    );

    if (toDelete.url && typeof toDelete.url === 'string' && toDelete.url.startsWith('/uploads/')) {
      const localPath = path.join(__dirname, '../../', toDelete.url);
      fs.unlink(localPath, () => {});
    }

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
