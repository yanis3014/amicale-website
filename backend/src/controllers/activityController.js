const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');

const CATEGORIES = ['projet', 'vie_etudiante', 'flash_info', 'evenement', 'partenariat'];

exports.list = async (req, res) => {
  try {
    const { category, search, all } = req.query;
    const isAdminAll = req.user && req.user.role === 'admin' && all === 'true';
    let sql = `
      SELECT id, title, summary, content, category, main_image, gallery_images, author_id, is_published, published_at, created_at, updated_at
      FROM activities WHERE 1=1
    `;
    if (!isAdminAll) sql += ` AND is_published = true`;
    const params = [];
    let i = 1;
    if (category && CATEGORIES.includes(category)) {
      sql += ` AND category = $${i}`;
      params.push(category);
      i++;
    }
    if (search) {
      sql += ` AND (title ILIKE $${i} OR summary ILIKE $${i})`;
      params.push(`%${search}%`);
      i++;
    }
    sql += ` ORDER BY published_at DESC NULLS LAST, created_at DESC`;
    const result = await query(sql, params);
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getById = async (req, res) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin' && req.query.admin === 'true';
    const result = await query(
      `SELECT id, title, summary, content, category, main_image, gallery_images, author_id, is_published, published_at, created_at, updated_at
       FROM activities WHERE id = $1 AND (is_published = true OR $2::boolean)`,
      [req.params.id, isAdmin]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Activité introuvable' });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.create = [
  body('title').trim().notEmpty().withMessage('Titre requis'),
  body('summary').optional().trim(),
  body('content').optional().trim(),
  body('category').isIn(CATEGORIES).withMessage('Catégorie invalide'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { title, summary, content, category } = req.body;
      const author_id = req.user.id;
      const result = await query(
        `INSERT INTO activities (title, summary, content, category, author_id)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [title, summary || null, content || null, category, author_id]
      );
      return res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

exports.update = [
  body('title').optional().trim().notEmpty(),
  body('summary').optional().trim(),
  body('content').optional().trim(),
  body('category').optional().isIn(CATEGORIES),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const id = req.params.id;
      const fields = ['title', 'summary', 'content', 'category'];
      const updates = [];
      const values = [];
      let i = 1;
      for (const f of fields) {
        if (req.body[f] !== undefined) {
          updates.push(`${f} = $${i}`);
          values.push(req.body[f]);
          i++;
        }
      }
      if (updates.length === 0) {
        const r = await query('SELECT * FROM activities WHERE id = $1', [id]);
        if (r.rows.length === 0) return res.status(404).json({ error: 'Activité introuvable' });
        return res.json(r.rows[0]);
      }
      values.push(id);
      const result = await query(
        `UPDATE activities SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
        values
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Activité introuvable' });
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },
];

exports.remove = async (req, res) => {
  try {
    const result = await query('DELETE FROM activities WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Activité introuvable' });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.publish = async (req, res) => {
  try {
    const result = await query(
      `UPDATE activities SET is_published = NOT is_published, published_at = CASE WHEN is_published THEN NULL ELSE NOW() END WHERE id = $1 RETURNING id, is_published, published_at`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Activité introuvable' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Fichier image requis' });
    const url = `/uploads/activities/${req.file.filename}`;
    await query('UPDATE activities SET main_image = $1 WHERE id = $2', [url, req.params.id]);
    const result = await query('SELECT id, main_image FROM activities WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Activité introuvable' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.uploadGallery = async (req, res) => {
  try {
    const id = req.params.id;
    const current = await query('SELECT gallery_images FROM activities WHERE id = $1', [id]);
    if (current.rows.length === 0) return res.status(404).json({ error: 'Activité introuvable' });
    let gallery = current.rows[0].gallery_images || [];
    if (!Array.isArray(gallery)) gallery = [];
    const files = req.files || [];
    if (gallery.length + files.length > 6) return res.status(400).json({ error: 'Maximum 6 images en galerie' });
    for (const f of files) {
      gallery.push(`/uploads/activities/${f.filename}`);
    }
    await query('UPDATE activities SET gallery_images = $1 WHERE id = $2', [JSON.stringify(gallery), id]);
    const result = await query('SELECT id, gallery_images FROM activities WHERE id = $1', [id]);
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.deleteGalleryImage = async (req, res) => {
  try {
    const id = req.params.id;
    const index = parseInt(req.params.index, 10);
    if (isNaN(index) || index < 0) return res.status(400).json({ error: 'Index invalide' });
    const current = await query('SELECT gallery_images FROM activities WHERE id = $1', [id]);
    if (current.rows.length === 0) return res.status(404).json({ error: 'Activité introuvable' });
    let gallery = current.rows[0].gallery_images || [];
    if (!Array.isArray(gallery)) gallery = [];
    if (index >= gallery.length) return res.status(404).json({ error: 'Image introuvable' });
    gallery.splice(index, 1);
    await query('UPDATE activities SET gallery_images = $1 WHERE id = $2', [JSON.stringify(gallery), id]);
    const result = await query('SELECT id, gallery_images FROM activities WHERE id = $1', [id]);
    return res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
