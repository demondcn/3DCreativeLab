import { createNeonAuth } from "@neon/auth/next/server";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isAdminEmail } from "@/lib/auth/authorization";

export { isAdminEmail } from "@/lib/auth/authorization";

export const auth = process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET
  ? createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL,
      cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET },
      logLevel: "warn",
    })
  : null;

export const getSession = cache(async () => {
  if (!auth) return null;
  const { data } = await auth.getSession();
  return data ?? null;
});

export function isAdminSession(session: { user?: { email?: string | null } } | null) {
  return isAdminEmail(session?.user?.email);
}

export async function getAdminSession() {
  const session = await getSession();
  return isAdminSession(session) ? session : null;
}

export async function requireAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function requireSessionPage() {
  const session = await getSession();
  if (!session) redirect("/iniciar-sesion");
  return session;
}

