/**
 * Envoie les emails de rappel pour les événements dans les prochaines 24h.
 * À lancer en cron quotidien, ex. : 0 9 * * * node scripts/send-event-reminders.js
 *
 * Nécessite d'être exécuté depuis la racine du backend (process.cwd() = backend).
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { pool } = require('../src/config/db');
const { sendEventReminder } = require('../src/services/emailService');

async function main() {
  const client = await pool.connect();
  try {
    // Événements dont la date est dans les 24 prochaines heures (et pas passés)
    const result = await client.query(
      `SELECT e.id, e.titre, e.date, e.lieu,
              r.id AS registration_id, u.id AS user_id, u.email, u.nom, u.prenom
       FROM events e
       JOIN registrations r ON r.event_id = e.id AND r.user_id IS NOT NULL AND r.statut IN ('pending', 'confirmed')
       JOIN users u ON u.id = r.user_id
       WHERE e.date >= NOW() AND e.date <= NOW() + INTERVAL '24 hours'
       ORDER BY e.date, r.id`
    );

    const sent = new Set();
    for (const row of result.rows) {
      const key = `${row.registration_id}`;
      if (sent.has(key)) continue;
      sent.add(key);
      const event = { id: row.id, titre: row.titre, date: row.date, lieu: row.lieu };
      const toName = [row.prenom, row.nom].filter(Boolean).join(' ') || row.email;
      const eventDate = new Date(row.date);
      const now = new Date();
      const diffHours = (eventDate - now) / (1000 * 60 * 60);
      const daysUntil = diffHours < 24 ? 0 : 1;
      await sendEventReminder({
        toEmail: row.email,
        toName,
        event,
        daysUntil,
      });
      console.log(`Rappel envoyé: ${row.email} — ${row.titre}`);
    }
    console.log(`Total: ${sent.size} rappel(s) envoyé(s).`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
