const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function csrfMiddleware(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();

  const hasCookieAuth = Boolean(req.cookies && req.cookies.auth_token);
  if (!hasCookieAuth) return next();

  const csrfCookie = req.cookies?.csrf_token;
  const csrfHeader = req.headers['x-csrf-token'];
  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({ error: 'CSRF token invalide' });
  }
  return next();
}

module.exports = { csrfMiddleware };
