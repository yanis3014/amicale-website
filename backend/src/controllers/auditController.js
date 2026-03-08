const { query } = require('../config/db');

exports.list = async (req, res) => {
  try {
    const { user_id, admin_identifier, action, limit = '100', offset = '0' } = req.query;
    const lim = Math.min(parseInt(limit, 10) || 100, 500);
    const off = Math.max(0, parseInt(offset, 10) || 0);

    let sql = `
      SELECT id, user_id, user_email, admin_identifier, action, method, path, resource_type, resource_id, details, ip_address, created_at
      FROM audit_log
      WHERE 1=1
    `;
    const params = [];
    let i = 1;
    if (user_id) {
      sql += ` AND user_id = $${i}`;
      params.push(user_id);
      i++;
    }
    if (admin_identifier) {
      sql += ` AND admin_identifier = $${i}`;
      params.push(admin_identifier);
      i++;
    }
    if (action) {
      sql += ` AND action ILIKE $${i}`;
      params.push(`%${action}%`);
      i++;
    }
    sql += ` ORDER BY created_at DESC LIMIT $${i} OFFSET $${i + 1}`;
    params.push(lim, off);

    const result = await query(sql, params);
    let countSql = 'SELECT COUNT(*) AS total FROM audit_log WHERE 1=1';
    const countParams = [];
    let j = 1;
    if (user_id) {
      countSql += ` AND user_id = $${j}`;
      countParams.push(user_id);
      j++;
    }
    if (admin_identifier) {
      countSql += ` AND admin_identifier = $${j}`;
      countParams.push(admin_identifier);
      j++;
    }
    if (action) {
      countSql += ` AND action ILIKE $${j}`;
      countParams.push(`%${action}%`);
    }
    const countResult = await query(countSql, countParams);
    const total = parseInt(countResult.rows[0]?.total || 0, 10);

    return res.json({
      items: result.rows,
      total,
      limit: lim,
      offset: off,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.listAdmins = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, nom, prenom, email, admin_identifier, numero_membre
       FROM users
       WHERE role = 'admin'
       ORDER BY admin_identifier NULLS LAST, id`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
