import { createNeonAuth } from "@neon/auth/next/server";
import { redirect } from "next/navigation";

export const auth = process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET
  ? createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL,
      cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET },
      logLevel: "warn",
    })
  : null;

export async function getAdminSession() {
  if (!auth) return null;
  const { data } = await auth.getSession();
  const email = data?.user?.email?.toLocaleLowerCase("en");
  return email && email === process.env.ADMIN_EMAIL?.trim().toLocaleLowerCase("en") ? data : null;
}

export async function requireAdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

