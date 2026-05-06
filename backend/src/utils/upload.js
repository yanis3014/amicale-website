const path = require('path');

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-');
}

function createSafeFilename(file) {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const base = path.basename(file.originalname || 'file', ext);
  return `${Date.now()}-${sanitizeFilename(base)}${ext}`;
}

function buildImageFilter() {
  const allowedExt = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
  const allowedMime = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
  return (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (!allowedExt.has(ext) || !allowedMime.has(file.mimetype)) {
      return cb(new Error('Type de fichier image non autorise'));
    }
    return cb(null, true);
  };
}

function buildPdfFilter() {
  return (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (ext !== '.pdf' || file.mimetype !== 'application/pdf') {
      return cb(new Error('Seuls les PDF sont autorises'));
    }
    return cb(null, true);
  };
}

function buildDocumentsFilter() {
  const allowedExt = new Set(['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']);
  const allowedMime = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ]);
  return (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (!allowedExt.has(ext) || !allowedMime.has(file.mimetype)) {
      return cb(new Error('Type de document non autorise'));
    }
    return cb(null, true);
  };
}

module.exports = {
  createSafeFilename,
  buildImageFilter,
  buildPdfFilter,
  buildDocumentsFilter,
};
