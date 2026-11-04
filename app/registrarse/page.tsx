import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/register-form";
import { SiteHeader } from "@/components/site-header";
import { getSession, isAdminSession } from "@/lib/auth/server";
import { authCallbackUrl, configuredSiteUrl } from "@/lib/site-url";

export default async function RegisterPage() {
  const session = await getSession();
  if (session) redirect(isAdminSession(session) ? "/admin" : "/cuenta");
  const callbackUrl = authCallbackUrl(configuredSiteUrl(), "/iniciar-sesion?verificado=1");
  return <><SiteHeader /><main className="admin-login auth-screen"><div><h1>Crear cuenta</h1><p>Registra tus datos y confirma tu correo para acceder como cliente de 3DCreativeLab.</p></div><RegisterForm verificationCallbackUrl={callbackUrl} /></main></>;
}
