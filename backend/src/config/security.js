function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Convertit une valeur style jsonwebtoken ("7d", "12h", "3600" secondes) en millisecondes pour Set-Cookie maxAge.
 */
function jwtExpiresInToMs(expiresIn) {
  if (typeof expiresIn === 'number' && Number.isFinite(expiresIn) && expiresIn > 0) {
    return expiresIn < 1e12 ? Math.round(expiresIn * 1000) : Math.round(expiresIn);
  }
  const s = String(expiresIn || '7d').trim();
  if (/^\d+(\.\d+)?$/.test(s)) {
    const n = parseFloat(s);
    return n < 1e12 ? Math.round(n * 1000) : Math.round(n);
  }
  const m = /^(\d+(?:\.\d+)?)\s*([smhd])$/i.exec(s.replace(/\s/g, ''));
  if (!m) return 7 * 24 * 60 * 60 * 1000;
  const n = parseFloat(m[1]);
  const u = m[2].toLowerCase();
  const mult = u === 's' ? 1000 : u === 'm' ? 60000 : u === 'h' ? 3600000 : 86400000;
  return Math.round(n * mult);
}

/** COOKIE_SAME_SITE=strict|lax|none — "none" impose Secure (HTTPS). */
function resolvedSameSite() {
  const raw = (process.env.COOKIE_SAME_SITE || '').trim().toLowerCase();
  if (raw === 'none' || raw === 'lax' || raw === 'strict') return raw;
  return isProduction() ? 'strict' : 'lax';
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length < 32) {
    throw new Error('JWT_SECRET manquant ou trop court (minimum 32 caracteres).');
  }
  return secret;
}

/** Domaine cookie optionnel, ex. .example.com (sous-domaines + apex si bien configure). */
function resolvedCookieDomain() {
  const d = (process.env.COOKIE_DOMAIN || '').trim();
  return d || undefined;
}

function getCookieOptions(maxAgeMs) {
  const sameSite = resolvedSameSite();
  const prod = isProduction();
  const secure = prod || sameSite === 'none';
  const domain = resolvedCookieDomain();
  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: maxAgeMs,
    ...(domain ? { domain } : {}),
  };
}

function getCsrfCookieOptions(maxAgeMs) {
  const sameSite = resolvedSameSite();
  const prod = isProduction();
  const secure = prod || sameSite === 'none';
  const domain = resolvedCookieDomain();
  return {
    httpOnly: false,
    secure,
    sameSite,
    path: '/',
    maxAge: maxAgeMs,
    ...(domain ? { domain } : {}),
  };
}

/** Options a repasser a res.clearCookie pour que le navigateur supprime bien les cookies (meme SameSite/Secure). */
function getSessionCookieClearOptions() {
  const sameSite = resolvedSameSite();
  const domain = resolvedCookieDomain();
  return {
    path: '/',
    sameSite,
    secure: isProduction() || sameSite === 'none',
    ...(domain ? { domain } : {}),
  };
}

module.exports = {
  isProduction,
  getJwtSecret,
  jwtExpiresInToMs,
  getCookieOptions,
  getCsrfCookieOptions,
  getSessionCookieClearOptions,
};
