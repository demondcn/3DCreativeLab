import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { SiteHeader } from "@/components/site-header";
import { getSession, isAdminSession } from "@/lib/auth/server";
import { authCallbackUrl, configuredSiteUrl } from "@/lib/site-url";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ verificado?: string; error?: string }> }) {
  const session = await getSession();
  if (session) redirect(isAdminSession(session) ? "/admin" : "/cuenta");
  const params = await searchParams;
  const verificationCallbackUrl = authCallbackUrl(configuredSiteUrl(), "/iniciar-sesion?verificado=1");
  return <><SiteHeader /><main className="admin-login auth-screen"><div><h1>Iniciar sesión</h1><p>Accede a tu cuenta para consultar tus datos y volver al catálogo.</p>{params.verificado === "1" && !params.error && <p className="auth-status" role="status">Tu correo fue verificado. Ya puedes iniciar sesión.</p>}{params.error && <p className="auth-status" role="alert">El enlace de verificación es inválido o venció. Inicia sesión para solicitar otro.</p>}</div><LoginForm forgotHref="/recuperar-contrasena" successHref="/iniciar-sesion?sesion=1" verificationCallbackUrl={verificationCallbackUrl} /></main></>;
}
