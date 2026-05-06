const { query } = require('../config/db');
const { generateEventCertificate } = require('../services/certificateService');

exports.listEligibleByEvent = async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);
    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).json({ error: 'Identifiant événement invalide' });
    }

    const eventResult = await query(
      'SELECT id, titre, date, lieu FROM events WHERE id = $1',
      [eventId]
    );
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Événement introuvable' });
    }

    const regs = await query(
      `SELECT
         r.id AS registration_id,
         r.user_id,
         r.statut,
         r.created_at,
         u.nom,
         u.prenom,
         u.email,
         c.id AS certificate_id,
         c.file_url AS certificate_file_url,
         c.created_at AS certificate_created_at
       FROM registrations r
       JOIN users u ON u.id = r.user_id
       LEFT JOIN certificates c
         ON c.user_id = r.user_id
        AND c.event_id = r.event_id
       WHERE r.event_id = $1
         AND r.user_id IS NOT NULL
       ORDER BY r.created_at DESC`,
      [eventId]
    );

    const items = regs.rows.map((row) => ({
      registration_id: row.registration_id,
      user_id: row.user_id,
      statut: row.statut,
      created_at: row.created_at,
      nom: row.nom,
      prenom: row.prenom,
      email: row.email,
      has_certificate: !!row.certificate_id,
      certificate_id: row.certificate_id || null,
      certificate_file_url: row.certificate_file_url || null,
      certificate_created_at: row.certificate_created_at || null,
      eligible: row.statut === 'confirmed' && !row.certificate_id,
    }));

    return res.json({
      event: eventResult.rows[0],
      items,
    });
  } catch (err) {
    console.error('[adminCertificateController.listEligibleByEvent]', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.sendOneByRegistration = async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);
    const registrationId = Number(req.params.registrationId);
    if (
      !Number.isInteger(eventId) || eventId <= 0 ||
      !Number.isInteger(registrationId) || registrationId <= 0
    ) {
      return res.status(400).json({ error: 'Paramètres invalides' });
    }

    const rowResult = await query(
      `SELECT r.id AS registration_id, r.user_id, r.statut,
              u.nom, u.prenom, u.email,
              e.id AS event_id, e.titre, e.date, e.lieu
       FROM registrations r
       JOIN users u ON u.id = r.user_id
       JOIN events e ON e.id = r.event_id
       WHERE r.id = $1 AND r.event_id = $2`,
      [registrationId, eventId]
    );

    if (rowResult.rows.length === 0) {
      return res.status(404).json({ error: 'Inscription introuvable pour cet événement' });
    }

    const reg = rowResult.rows[0];
    if (reg.statut !== 'confirmed') {
      return res.status(400).json({ error: 'Seules les inscriptions confirmées sont éligibles' });
    }

    const certificate = await generateEventCertificate({
      user: { id: reg.user_id, nom: reg.nom, prenom: reg.prenom, email: reg.email },
      event: { id: reg.event_id, titre: reg.titre, date: reg.date, lieu: reg.lieu },
    });

    return res.json({
      sent: !!certificate,
      already_exists: !certificate,
      certificate: certificate || null,
    });
  } catch (err) {
    console.error('[adminCertificateController.sendOneByRegistration]', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.sendBatchByEvent = async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);
    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).json({ error: 'Identifiant événement invalide' });
    }

    const eventResult = await query(
      'SELECT id, titre, date, lieu FROM events WHERE id = $1',
      [eventId]
    );
    if (eventResult.rows.length === 0) {
      return res.status(404).json({ error: 'Événement introuvable' });
    }
    const event = eventResult.rows[0];

    const registrations = await query(
      `SELECT r.id AS registration_id, u.id AS user_id, u.nom, u.prenom, u.email
       FROM registrations r
       JOIN users u ON u.id = r.user_id
       LEFT JOIN certificates c
         ON c.user_id = r.user_id
        AND c.event_id = r.event_id
       WHERE r.event_id = $1
         AND r.user_id IS NOT NULL
         AND r.statut = 'confirmed'
         AND c.id IS NULL
       ORDER BY r.created_at ASC`,
      [eventId]
    );

    let sent = 0;
    const failed = [];
    for (const reg of registrations.rows) {
      try {
        const cert = await generateEventCertificate({
          user: { id: reg.user_id, nom: reg.nom, prenom: reg.prenom, email: reg.email },
          event,
        });
        if (cert) sent += 1;
      } catch (error) {
        failed.push({
          registration_id: reg.registration_id,
          user_id: reg.user_id,
          email: reg.email,
          error: error?.message || 'Erreur inconnue',
        });
      }
    }

    return res.json({
      attempted: registrations.rows.length,
      sent,
      failed,
    });
  } catch (err) {
    console.error('[adminCertificateController.sendBatchByEvent]', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
