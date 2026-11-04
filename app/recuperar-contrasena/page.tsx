import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { SiteHeader } from "@/components/site-header";
import { authCallbackUrl, configuredSiteUrl } from "@/lib/site-url";

export default function ForgotPasswordPage() {
  const resetUrl = authCallbackUrl(configuredSiteUrl(), "/restablecer-contrasena");
  return <><SiteHeader /><main className="admin-login auth-screen"><div><h1>Recuperar acceso</h1><p>Solicita un enlace seguro para establecer una contraseña nueva.</p></div><ForgotPasswordForm resetUrl={resetUrl} /></main></>;
}
