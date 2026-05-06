const { query } = require('../config/db');

/**
 * Enregistre une action dans le journal d'audit.
 * @param {object} opts - user_id, user_email, admin_identifier, action, method, path, resource_type?, resource_id?, details?, ip_address?
 */
async function logAction(opts) {
  const {
    user_id,
    user_email,
    admin_identifier,
    action,
    method,
    path,
    resource_type = null,
    resource_id = null,
    details = null,
    ip_address = null,
  } = opts;
  try {
    await query(
      `INSERT INTO audit_log (user_id, user_email, admin_identifier, action, method, path, resource_type, resource_id, details, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        user_id,
        user_email || null,
        admin_identifier || null,
        action,
        method,
        path,
        resource_type,
        resource_id,
        details ? JSON.stringify(details) : null,
        ip_address,
      ]
    );
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
}

const PATH_LABELS = {
  admin: {
    stats: 'Consultation statistiques',
    events: 'Événements',
    members: 'Membres',
    enseignants: 'Enseignants',
    partenaires: 'Partenaires',
    settings: 'Paramètres',
    pages: 'Pages',
    avantages: 'Avantages',
    'audit-logs': 'Journal d\'audit',
    finances: 'Finances',
  },
  api: {
    events: 'Événement',
    activities: 'Annonce / Activité',
    enseignants: 'Enseignant',
    partenaires: 'Partenaire',
  },
};

/**
 * Dérive un libellé d'action lisible à partir de method + path
 */
function getActionLabel(method, path) {
  const isAdmin = path.startsWith('/api/admin');
  const prefix = isAdmin ? '/api/admin/' : '/api/';
  const base = (path.startsWith(prefix) ? path.slice(prefix.length) : path).split('/').filter(Boolean);
  const segment = base[0] || '';
  const id = base[1];
  const second = base[2];
  const labels = isAdmin ? PATH_LABELS.admin : PATH_LABELS.api;
  const resource = labels[segment] || segment;
  if (method === 'GET') {
    if (second === 'confirm') return null;
    return id ? `Consultation ${resource}` : `Liste ${resource}`;
  }
  if (method === 'PUT' || method === 'PATCH') {
    if (segment === 'settings') return 'Modification paramètre';
    if (segment === 'pages') return 'Upload page';
    if (path.includes('publish')) return `Publication ${resource}`;
    if (path.includes('registrations') && second === 'confirm') return 'Confirmation inscription';
    if (path.includes('registrations') && second === 'cancel') return 'Annulation inscription';
    return id ? `Modification ${resource}` : null;
  }
  if (method === 'POST') {
    if (path.includes('upload-image') || path.includes('upload-gallery') || path.includes('upload-photo') || path.includes('upload-logo')) return `Upload ${resource}`;
    if (path.includes('register')) return null;
    if (segment === 'members') return 'Création membre';
    return `Création ${resource}`;
  }
  if (method === 'DELETE') return id ? `Suppression ${resource}` : null;
  return `${method} ${resource}`;
}

/**
 * Extrait resource_type et resource_id du path
 */
function getResourceFromPath(path) {
  const isAdmin = path.startsWith('/api/admin');
  const prefix = isAdmin ? '/api/admin/' : '/api/';
  const base = (path.startsWith(prefix) ? path.slice(prefix.length) : path).split('/').filter(Boolean);
  const segment = base[0] || '';
  const id = base[1];
  const numId = id && /^\d+$/.test(id) ? id : null;
  return { resource_type: segment || null, resource_id: numId };
}

module.exports = { logAction, getActionLabel, getResourceFromPath };
