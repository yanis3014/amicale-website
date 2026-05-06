/**
 * Construit l'URL complète d'une image servie par l'API backend.
 * @param path - Chemin relatif (ex: /uploads/events/123-image.jpg)
 * @returns URL absolue vers l'image
 */
export function getImageUrl(path: string | null | undefined): string {
  if (!path) return '';
  // Les URLs Supabase/externes sont déjà absolues.
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_API_URL || '';
  const baseUrl = base.replace(/\/$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
