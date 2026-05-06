const fs = require('fs');
const path = require('path');
const PDFKitDocument = require('pdfkit');
const { PDFDocument: PDFLibDocument, StandardFonts, rgb } = require('pdf-lib');
const { query } = require('../config/db');
const { sendMail } = require('./emailService');

const CERTIFICATES_DIR = path.join(__dirname, '../../uploads/certificates');

function sanitizeFilePart(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function formatDateFR(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function buildPdfBuffer(lines) {
  return new Promise((resolve, reject) => {
    const doc = new PDFKitDocument({ size: 'A4', margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text('Amicale de la Faculte de Pharmacie de Monastir', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(16).text('Certificat', { align: 'center' });
    doc.moveDown(1.5);
    doc.fontSize(12);

    lines.forEach((line) => {
      doc.text(line);
      doc.moveDown(0.5);
    });

    doc.moveDown(1);
    doc.fontSize(10).fillColor('#666').text(`Genere automatiquement le ${new Date().toLocaleString('fr-FR')}`, { align: 'right' });
    doc.end();
  });
}

function parseNumberOrDefault(value, fallback) {
  if (value == null || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function getSettingValue(key) {
  const result = await query('SELECT value FROM page_settings WHERE key = $1 LIMIT 1', [key]);
  return result.rows[0]?.value || null;
}

async function buildEventCertificateFromTemplate({ fullName }) {
  const templateUrl = await getSettingValue('certificate_event_template_pdf');
  if (!templateUrl || !templateUrl.startsWith('/uploads/')) return null;

  const templateDiskPath = path.join(__dirname, '../../', templateUrl);
  let templateBytes;
  try {
    templateBytes = await fs.promises.readFile(templateDiskPath);
  } catch (err) {
    console.error('Impossible de lire le template PDF certificat:', err?.message || err);
    return null;
  }

  try {
    const [xValue, yValue, sizeValue] = await Promise.all([
      getSettingValue('certificate_event_name_x'),
      getSettingValue('certificate_event_name_y'),
      getSettingValue('certificate_event_name_size'),
    ]);
    const x = parseNumberOrDefault(xValue, 170);
    const y = parseNumberOrDefault(yValue, 255);
    const size = parseNumberOrDefault(sizeValue, 28);

    const pdfDoc = await PDFLibDocument.load(templateBytes);
    const pages = pdfDoc.getPages();
    if (pages.length === 0) return null;
    const firstPage = pages[0];
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    firstPage.drawText(fullName, {
      x,
      y,
      size,
      font,
      color: rgb(0.08, 0.08, 0.08),
    });

    return Buffer.from(await pdfDoc.save());
  } catch (err) {
    console.error('Erreur de personnalisation du template PDF certificat:', err?.message || err);
    return null;
  }
}

async function saveCertificateFile({ fileName, buffer }) {
  await fs.promises.mkdir(CERTIFICATES_DIR, { recursive: true });
  const diskPath = path.join(CERTIFICATES_DIR, fileName);
  await fs.promises.writeFile(diskPath, buffer);
  return `/uploads/certificates/${fileName}`;
}

async function saveCertificateMetadata({
  userId,
  eventId = null,
  cotisationId = null,
  certificateType,
  title,
  fileName,
  fileUrl,
}) {
  const result = await query(
    `INSERT INTO certificates (user_id, event_id, cotisation_id, certificate_type, title, file_name, file_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id, event_id) WHERE event_id IS NOT NULL DO NOTHING
     RETURNING *`,
    [userId, eventId, cotisationId, certificateType, title, fileName, fileUrl]
  );

  if (result.rows.length > 0) return result.rows[0];

  if (cotisationId) {
    const existingCot = await query(
      'SELECT * FROM certificates WHERE user_id = $1 AND cotisation_id = $2 LIMIT 1',
      [userId, cotisationId]
    );
    if (existingCot.rows.length > 0) return existingCot.rows[0];
  }

  if (eventId) {
    const existingEvent = await query(
      'SELECT * FROM certificates WHERE user_id = $1 AND event_id = $2 LIMIT 1',
      [userId, eventId]
    );
    if (existingEvent.rows.length > 0) return existingEvent.rows[0];
  }

  return null;
}

async function saveCotisationCertificateMetadata(params) {
  const { userId, cotisationId, certificateType, title, fileName, fileUrl } = params;
  const result = await query(
    `INSERT INTO certificates (user_id, event_id, cotisation_id, certificate_type, title, file_name, file_url)
     VALUES ($1, NULL, $2, $3, $4, $5, $6)
     ON CONFLICT (user_id, cotisation_id) WHERE cotisation_id IS NOT NULL DO NOTHING
     RETURNING *`,
    [userId, cotisationId, certificateType, title, fileName, fileUrl]
  );

  if (result.rows.length > 0) return result.rows[0];

  const existing = await query(
    'SELECT * FROM certificates WHERE user_id = $1 AND cotisation_id = $2 LIMIT 1',
    [userId, cotisationId]
  );
  return existing.rows[0] || null;
}

async function sendCertificateEmail({ toEmail, fullName, title, fileUrl }) {
  if (!toEmail) return;
  const apiBase = (process.env.API_PUBLIC_URL || process.env.BACKEND_PUBLIC_URL || 'http://localhost:4000').replace(/\/$/, '');
  const downloadUrl = /^https?:\/\//i.test(fileUrl) ? fileUrl : `${apiBase}${fileUrl}`;
  const subject = `Votre certificat est disponible - ${title}`;
  const text = `Bonjour ${fullName},\n\nVotre certificat "${title}" est maintenant disponible.\nLien de telechargement: ${downloadUrl}\n\nCordialement,\nL'Amicale FPHM`;
  const html = `<p>Bonjour ${fullName},</p><p>Votre certificat <strong>${title}</strong> est maintenant disponible.</p><p><a href="${downloadUrl}">Telecharger le certificat</a></p><p>Cordialement,<br/>L'Amicale FPHM</p>`;
  await sendMail({ to: toEmail, subject, text, html });
}

async function generateEventCertificate({ user, event }) {
  const title = `Certificat d'inscription - ${event.titre}`;
  const safeTitle = sanitizeFilePart(event.titre);
  const fileName = `cert-event-${event.id}-user-${user.id}-${Date.now()}-${safeTitle}.pdf`;

  const fullName = `${user.prenom} ${user.nom}`.trim();
  const templateBuffer = await buildEventCertificateFromTemplate({ fullName });
  const pdfBuffer = templateBuffer || await buildPdfBuffer([
    `Ce document atteste que ${fullName} est inscrit(e) a l'evenement suivant :`,
    `Titre : ${event.titre}`,
    event.date ? `Date : ${formatDateFR(event.date)}` : '',
    event.lieu ? `Lieu : ${event.lieu}` : '',
  ].filter(Boolean));

  const fileUrl = await saveCertificateFile({ fileName, buffer: pdfBuffer });
  const certificate = await saveCertificateMetadata({
    userId: user.id,
    eventId: event.id,
    certificateType: 'event_registration',
    title,
    fileName,
    fileUrl,
  });

  if (!certificate) return null;
  await sendCertificateEmail({
    toEmail: user.email,
    fullName,
    title,
    fileUrl,
  });

  return certificate;
}

async function generateCotisationCertificate({ user, cotisation }) {
  const title = `Certificat de cotisation - ${cotisation.annee_universitaire}`;
  const fileName = `cert-cotisation-${cotisation.id}-user-${user.id}-${Date.now()}.pdf`;
  const pdfBuffer = await buildPdfBuffer([
    `Ce document atteste que ${user.prenom} ${user.nom} est adherent(e) pour l'annee universitaire ${cotisation.annee_universitaire}.`,
    `Montant regle : ${Number(cotisation.montant).toFixed(2)} DT`,
    cotisation.confirmed_at ? `Date de confirmation : ${formatDateFR(cotisation.confirmed_at)}` : `Date de confirmation : ${formatDateFR(new Date())}`,
  ]);

  const fileUrl = await saveCertificateFile({ fileName, buffer: pdfBuffer });
  const certificate = await saveCotisationCertificateMetadata({
    userId: user.id,
    cotisationId: cotisation.id,
    certificateType: 'cotisation_confirmation',
    title,
    fileName,
    fileUrl,
  });

  if (!certificate) return null;
  await sendCertificateEmail({
    toEmail: user.email,
    fullName: `${user.prenom} ${user.nom}`.trim(),
    title,
    fileUrl,
  });
  return certificate;
}

async function listMemberCertificates(userId) {
  const result = await query(
    `SELECT id, user_id, event_id, cotisation_id, certificate_type, title, file_url, created_at
     FROM certificates
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

module.exports = {
  generateEventCertificate,
  generateCotisationCertificate,
  listMemberCertificates,
};
