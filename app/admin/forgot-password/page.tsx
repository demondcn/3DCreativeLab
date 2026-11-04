import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { SiteHeader } from "@/components/site-header";
import { getAdminSession } from "@/lib/auth/server";
import { authCallbackUrl, configuredSiteUrl } from "@/lib/site-url";

export default async function ForgotPasswordPage() {
  if (await getAdminSession()) redirect("/admin");
  const resetUrl = authCallbackUrl(configuredSiteUrl(), "/admin/reset-password");
  return <><SiteHeader /><main className="admin-login"><div><h1>Recuperar acceso</h1><p>Solicita un enlace seguro para establecer una nueva contraseña administrativa.</p></div><ForgotPasswordForm resetUrl={resetUrl} loginHref="/admin/login" /></main></>;
}
