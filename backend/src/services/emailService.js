/**
 * Envoi d'emails : confirmation d'inscription et rappels événements.
 * Configurer SMTP dans .env (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM)
 * pour activer l'envoi réel. Sinon les messages sont loggés en console.
 */

const nodemailer = require('nodemailer');

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

function getFrom() {
  return process.env.MAIL_FROM || process.env.SMTP_USER || 'noreply@amicale.local';
}

/**
 * Envoie un email (ou log en console si SMTP non configuré).
 */
async function sendMail({ to, subject, text, html }) {
  const transporter = getTransporter();
  const from = getFrom();
  const payload = { from, to, subject, text: text || undefined, html: html || undefined };

  if (!transporter) {
    console.log('[Email] (SMTP non configuré) Envoi simulé:', { to, subject });
    return;
  }
  await transporter.sendMail(payload);
}

/**
 * Email de confirmation d'inscription à un événement (membre ou invité).
 */
async function sendConfirmationEventRegistration({ toEmail, toName, event, isGuest }) {
  const dateStr = event.date
    ? new Date(event.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';
  const subject = `Inscription confirmée — ${event.titre}`;
  const text = `
Bonjour ${toName},

Votre inscription à l'événement « ${event.titre} » est bien enregistrée.

Date : ${dateStr}
${event.lieu ? `Lieu : ${event.lieu}` : ''}

${isGuest ? 'Vous vous êtes inscrit sans compte membre. Vous recevrez les détails par email.' : 'En tant que membre, vous recevrez un email de rappel avant l\'événement.'}

À bientôt,
L'Amicale FPHM
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Inscription confirmée</title></head>
<body style="font-family: sans-serif; line-height: 1.5; color: #333;">
  <p>Bonjour ${toName},</p>
  <p>Votre inscription à l'événement <strong>${event.titre}</strong> est bien enregistrée.</p>
  <p><strong>Date :</strong> ${dateStr}</p>
  ${event.lieu ? `<p><strong>Lieu :</strong> ${event.lieu}</p>` : ''}
  <p>${isGuest ? 'Vous vous êtes inscrit sans compte membre.' : 'En tant que membre, vous recevrez un email de rappel avant l\'événement.'}</p>
  <p>À bientôt,<br>L'Amicale FPHM</p>
</body>
</html>
  `.trim();

  await sendMail({ to: toEmail, subject, text, html });
}

/**
 * Email de rappel (J-1 ou J-0) pour les inscrits ayant un compte (user_id non null).
 */
async function sendEventReminder({ toEmail, toName, event, daysUntil = 1 }) {
  const dateStr = event.date
    ? new Date(event.date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';
  const subject = `Rappel : ${event.titre} — ${daysUntil === 0 ? "c'est demain !" : `dans ${daysUntil} jour${daysUntil > 1 ? 's' : ''}`}`;
  const text = `
Bonjour ${toName},

Rappel : vous êtes inscrit à l'événement « ${event.titre} ».

Date : ${dateStr}
${event.lieu ? `Lieu : ${event.lieu}` : ''}

À bientôt,
L'Amicale FPHM
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Rappel événement</title></head>
<body style="font-family: sans-serif; line-height: 1.5; color: #333;">
  <p>Bonjour ${toName},</p>
  <p>Rappel : vous êtes inscrit à l'événement <strong>${event.titre}</strong>.</p>
  <p><strong>Date :</strong> ${dateStr}</p>
  ${event.lieu ? `<p><strong>Lieu :</strong> ${event.lieu}</p>` : ''}
  <p>À bientôt,<br>L'Amicale FPHM</p>
</body>
</html>
  `.trim();

  await sendMail({ to: toEmail, subject, text, html });
}

module.exports = {
  sendMail,
  sendConfirmationEventRegistration,
  sendEventReminder,
};
