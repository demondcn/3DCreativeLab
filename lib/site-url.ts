const PRODUCTION_HOST = "3dcreativelab.vercel.app";

export function configuredSiteUrl(env?: { NEXT_PUBLIC_SITE_URL?: string; VERCEL_ENV?: string }) {
  const source = env ?? { NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL, VERCEL_ENV: process.env.VERCEL_ENV };
  const raw = source.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) throw new Error("NEXT_PUBLIC_SITE_URL es obligatoria para los enlaces de autenticación.");

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL debe ser una URL absoluta.");
  }

  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL debe contener únicamente el origen de la aplicación.");
  }
  if (source.VERCEL_ENV === "production" && (url.protocol !== "https:" || url.hostname !== PRODUCTION_HOST)) {
    throw new Error(`NEXT_PUBLIC_SITE_URL de producción debe ser https://${PRODUCTION_HOST}.`);
  }
  return url.origin;
}

export function authCallbackUrl(siteUrl: string, path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) throw new Error("La ruta de autenticación no es válida.");
  return new URL(path, `${siteUrl}/`).toString();
}
