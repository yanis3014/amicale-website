const { logAction, getActionLabel, getResourceFromPath } = require('../services/auditService');

// Ne consigner que les actions importantes (création, modification, suppression, confirmation, etc.)
// Pas de GET (consultation/listes), pas d'inscription membre à un événement
function isImportantAction(method, path) {
  if (method === 'GET') return false;
  if (method === 'POST' && path.includes('/register') && !path.includes('/registrations/')) return false;

  const norm = path.replace(/\?.*$/, '').replace(/\/\d+/g, '/:id');
  // Événements : création, modification, suppression, publication, uploads
  if (/^\/api\/events\/:id\/(upload-image|upload-gallery|gallery\/)/.test(norm) || /^\/api\/events\/:id\/publish/.test(norm)) return true;
  if (norm === '/api/events' && method === 'POST') return true;
  if (/^\/api\/events\/:id$/.test(norm) && (method === 'PUT' || method === 'DELETE')) return true;
  // Inscriptions admin : confirmation / annulation
  if (/^\/api\/events\/:id\/registrations\/:id\/(confirm|cancel)$/.test(norm)) return true;
  // Annonces / activités
  if (norm === '/api/activities' && method === 'POST') return true;
  if (/^\/api\/activities\/:id$/.test(norm) && (method === 'PUT' || method === 'DELETE')) return true;
  if (/^\/api\/activities\/:id\/(publish|upload-image|upload-gallery|gallery\/)/.test(norm)) return true;
  // Membres (admin) : création, modification, suppression
  if (norm === '/api/admin/members' && method === 'POST') return true;
  if (/^\/api\/admin\/members\/:id$/.test(norm) && (method === 'PUT' || method === 'DELETE')) return true;
  // Cotisations : confirmation, rejet
  if (/^\/api\/admin\/cotisations\/:id\/(confirm|reject)$/.test(norm)) return true;
  // Enseignants
  if (norm === '/api/enseignants' && method === 'POST') return true;
  if (/^\/api\/enseignants\/:id(\/(upload-photo|reorder))?$/.test(norm) && (method === 'PUT' || method === 'PATCH' || method === 'DELETE')) return true;
  // Partenaires
  if (norm === '/api/partenaires' && method === 'POST') return true;
  if (/^\/api\/partenaires\/:id(\/upload-logo)?$/.test(norm) && (method === 'PUT' || method === 'DELETE')) return true;
  if (/^\/api\/partenaires\/:id\/upload-logo$/.test(norm) && method === 'POST') return true;
  // Paramètres et pages
  if (/^\/api\/admin\/settings\/.+$/.test(norm) && method === 'PUT') return true;
  if (/^\/api\/admin\/pages\/.+$/.test(norm) && method === 'POST') return true;
  // Avantages
  if (norm === '/api/admin/avantages' && method === 'POST') return true;
  if (/^\/api\/admin\/avantages\/:id$/.test(norm) && (method === 'PUT' || method === 'DELETE')) return true;
  // Coupons
  if (norm === '/api/admin/coupons' && method === 'POST') return true;
  if (/^\/api\/admin\/coupons\/:id$/.test(norm) && (method === 'PUT' || method === 'DELETE')) return true;
  // Finances (entrées manuelles / sponsors)
  if (norm === '/api/admin/finances/entries' && method === 'POST') return true;
  if (/^\/api\/admin\/finances\/entries\/:id$/.test(norm) && (method === 'PUT' || method === 'DELETE')) return true;

  return false;
}

function auditMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return next();

  const path = req.originalUrl?.split('?')[0] || req.path || '';
  const method = req.method;
  if (!isImportantAction(method, path)) return next();

  const actionLabel = getActionLabel(method, path);
  const { resource_type, resource_id } = getResourceFromPath(path);
  const action = actionLabel || `${method} ${path}`;

  const details = {};
  if (req.body && typeof req.body === 'object' && method !== 'GET') {
    // Coupon : détails lisibles (code, type, réduction) sans termes techniques (is_active, max_uses)
    if (path.includes('/api/admin/coupons') && method === 'POST') {
      const b = req.body;
      const reduction = b.discount_type === 'percent'
        ? `${Number(b.discount_value) || 0} %`
        : `${Number(b.discount_value) || 0} DT`;
      const body = {
        code: b.code || '',
        type: b.type_coupon === 'event' ? 'Événement' : 'Adhésion',
        reduction,
        utilisations_max: b.max_uses != null ? Number(b.max_uses) : null,
      };
      if (b.valid_until) {
        try {
          const d = new Date(b.valid_until);
          body.valide_jusqu_au = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        } catch {
          body.valide_jusqu_au = b.valid_until;
        }
      }
      details.body = body;
    } else {
      const sanitized = { ...req.body };
      if (sanitized.password !== undefined) sanitized.password = '[REDACTED]';
      if (sanitized.password_hash !== undefined) sanitized.password_hash = '[REDACTED]';
      if (Object.keys(sanitized).length) details.body = sanitized;
    }
  }

  const ip = req.ip || req.connection?.remoteAddress || req.headers?.['x-forwarded-for']?.split(',')[0]?.trim();

  logAction({
    user_id: req.user.id,
    user_email: req.user.email,
    admin_identifier: req.user.admin_identifier || null,
    action,
    method,
    path,
    resource_type: resource_type || null,
    resource_id: resource_id || null,
    details: Object.keys(details).length ? details : null,
    ip_address: ip || null,
  }).catch(() => {});

  next();
}

module.exports = { auditMiddleware };
