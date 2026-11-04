import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { SiteHeader } from "@/components/site-header";
import { VerificationButton } from "@/components/verification-button";
import { isAdminSession, requireSessionPage } from "@/lib/auth/server";
import { authCallbackUrl, configuredSiteUrl } from "@/lib/site-url";

export default async function AccountPage() {
  const session = await requireSessionPage();
  const callbackUrl = authCallbackUrl(configuredSiteUrl(), "/iniciar-sesion?verificado=1");
  const verified = Boolean(session.user.emailVerified);
  return <><SiteHeader /><main className="account-page"><header><h1>Mi cuenta</h1><p>Datos asociados a tu acceso en 3DCreativeLab.</p></header><section className="account-panel" data-ui><dl><div><dt>Nombre</dt><dd>{session.user.name || "Sin nombre registrado"}</dd></div><div><dt>Correo electrónico</dt><dd>{session.user.email}</dd></div><div><dt>Verificación</dt><dd>{verified ? "Correo verificado" : "Verificación pendiente"}</dd></div></dl>{!verified && <VerificationButton email={session.user.email} callbackUrl={callbackUrl} />}<div className="account-actions"><Link className="button-dark" href="/productos">Ver catálogo</Link>{isAdminSession(session) && <Link className="button-dark" href="/admin">Panel administrativo</Link>}<LogoutButton className="button-dark" /></div></section></main></>;
}
