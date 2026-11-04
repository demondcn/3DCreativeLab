import { LoginForm } from "@/components/login-form";
import { authCallbackUrl, configuredSiteUrl } from "@/lib/site-url";

export function AdminLoginForm() {
  const verificationCallbackUrl = authCallbackUrl(configuredSiteUrl(), "/iniciar-sesion?verificado=1");
  return <LoginForm forgotHref="/admin/forgot-password" successHref="/admin" verificationCallbackUrl={verificationCallbackUrl} />;
}

