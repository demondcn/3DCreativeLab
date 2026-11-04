import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { SiteHeader } from "@/components/site-header";
import { getAdminSession } from "@/lib/auth/server";

export default async function ForgotPasswordPage() {
  if (await getAdminSession()) redirect("/admin");
  return <><SiteHeader /><main className="admin-login"><div><h1>Recuperar acceso</h1><p>Solicita un enlace seguro para establecer una nueva contraseña administrativa.</p></div><ForgotPasswordForm /></main></>;
}
