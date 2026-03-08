/**
 * Envoi d'emails par l'admin : à un membre ou à tous.
 */
const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');
const { sendMail } = require('../services/emailService');

function textToHtml(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

exports.send = [
  body('to').custom((val) => {
    if (val === 'all') return true;
    if (typeof val === 'number' || (typeof val === 'string' && /^\d+$/.test(val))) return true;
    throw new Error('Destinataire invalide : "all" ou id membre');
  }),
  body('subject').trim().notEmpty().withMessage('Objet requis'),
  body('message').trim().notEmpty().withMessage('Message requis'),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { to, subject, message } = req.body;

      let recipients = [];
      if (to === 'all') {
        const result = await query(
          `SELECT id, nom, prenom, email FROM users WHERE role != 'admin' AND email IS NOT NULL AND email != '' ORDER BY nom, prenom`
        );
        recipients = result.rows;
      } else {
        const memberId = typeof to === 'string' ? parseInt(to, 10) : to;
        const result = await query(
          'SELECT id, nom, prenom, email FROM users WHERE id = $1 AND role != \'admin\'',
          [memberId]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Membre introuvable' });
        }
        recipients = result.rows;
      }

      if (recipients.length === 0) {
        return res.status(400).json({ error: 'Aucun destinataire avec adresse email valide' });
      }

      const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${subject.replace(/</g, '&lt;')}</title></head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333;">
  <p>Bonjour {{toName}},</p>
  <div style="margin: 1em 0;">${textToHtml(message)}</div>
  <p style="margin-top: 1.5em;">Cordialement,<br>L'Amicale FPHM</p>
</body>
</html>`;

      let sent = 0;
      for (const r of recipients) {
        const toName = [r.prenom, r.nom].filter(Boolean).join(' ') || r.email;
        const personalizedHtml = html.replace('{{toName}}', toName.replace(/</g, '&lt;'));
        const text = `Bonjour ${toName},\n\n${message}\n\nCordialement,\nL'Amicale FPHM`;
        await sendMail({
          to: r.email,
          subject,
          text,
          html: personalizedHtml,
        });
        sent++;
      }

      return res.json({
        success: true,
        sent,
        total: recipients.length,
        message: sent === 1
          ? `Email envoyé à ${recipients[0].prenom} ${recipients[0].nom}`
          : `${sent} email(s) envoyé(s)`,
      });
    } catch (err) {
      console.error('[Email admin]', err);
      return res.status(500).json({ error: 'Erreur lors de l\'envoi' });
    }
  },
];
