const { query } = require('../config/db');

exports.stats = async (req, res) => {
  try {
    const [totalMembers, adherents, eventsTotal, eventsUpcoming, cotisationsPending, inscriptionsMonth, revenus, lastRegs] = await Promise.all([
      query('SELECT COUNT(*) AS c FROM users WHERE role = \'member\''),
      query('SELECT COUNT(*) AS c FROM users WHERE is_adherent = true AND (adherent_expires_at IS NULL OR adherent_expires_at >= NOW())'),
      query('SELECT COUNT(*) AS c FROM events'),
      query('SELECT COUNT(*) AS c FROM events WHERE date >= NOW()'),
      query('SELECT COUNT(*) AS c FROM cotisations WHERE statut = \'pending\''),
      query('SELECT COUNT(*) AS c FROM registrations WHERE created_at >= date_trunc(\'month\', CURRENT_DATE) AND statut != \'cancelled\''),
      query('SELECT COALESCE(SUM(montant_paye), 0) AS total FROM registrations WHERE statut = \'confirmed\' AND montant_paye IS NOT NULL'),
      query(
        `SELECT r.id, r.statut, r.montant_paye, r.created_at, r.user_id, r.event_id,
                u.nom, u.prenom, u.email,
                e.titre AS event_titre, e.date AS event_date
         FROM registrations r
         JOIN users u ON u.id = r.user_id
         JOIN events e ON e.id = r.event_id
         WHERE r.statut != 'cancelled'
         ORDER BY r.created_at DESC
         LIMIT 10`
      ),
    ]);
    return res.json({
      total_members: parseInt(totalMembers.rows[0].c, 10),
      adherents_actifs: parseInt(adherents.rows[0].c, 10),
      events_total: parseInt(eventsTotal.rows[0].c, 10),
      events_a_venir: parseInt(eventsUpcoming.rows[0].c, 10),
      cotisations_en_attente: parseInt(cotisationsPending.rows[0].c, 10),
      inscriptions_ce_mois: parseInt(inscriptionsMonth.rows[0].c, 10),
      revenus_total: parseFloat(revenus.rows[0].total) || 0,
      dernieres_inscriptions: lastRegs.rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
