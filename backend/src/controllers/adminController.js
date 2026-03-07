const { query } = require('../config/db');

exports.stats = async (req, res) => {
  try {
    const [totalMembers, adherents, eventsTotal, eventsUpcoming, cotisationsPending, inscriptionsMonth, revenus] = await Promise.all([
      query('SELECT COUNT(*) AS c FROM users WHERE role = \'member\''),
      query('SELECT COUNT(*) AS c FROM users WHERE is_adherent = true AND (adherent_expires_at IS NULL OR adherent_expires_at >= NOW())'),
      query('SELECT COUNT(*) AS c FROM events'),
      query('SELECT COUNT(*) AS c FROM events WHERE date >= NOW()'),
      query('SELECT COUNT(*) AS c FROM cotisations WHERE statut = \'pending\''),
      query('SELECT COUNT(*) AS c FROM registrations WHERE created_at >= date_trunc(\'month\', CURRENT_DATE) AND statut != \'cancelled\''),
      query('SELECT COALESCE(SUM(montant_paye), 0) AS total FROM registrations WHERE statut = \'confirmed\' AND montant_paye IS NOT NULL'),
    ]);
    return res.json({
      total_members: parseInt(totalMembers.rows[0].c, 10),
      adherents_actifs: parseInt(adherents.rows[0].c, 10),
      events_total: parseInt(eventsTotal.rows[0].c, 10),
      events_a_venir: parseInt(eventsUpcoming.rows[0].c, 10),
      cotisations_en_attente: parseInt(cotisationsPending.rows[0].c, 10),
      inscriptions_ce_mois: parseInt(inscriptionsMonth.rows[0].c, 10),
      revenus_total: parseFloat(revenus.rows[0].total) || 0,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
