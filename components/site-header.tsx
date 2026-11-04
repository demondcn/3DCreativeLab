import Link from "next/link";
import { CubeMark } from "./cube-mark";
import { AccountMenu } from "@/components/account-menu";
import { getSession, isAdminSession } from "@/lib/auth/server";

export async function SiteHeader() {
  const session = await getSession();
  return (
    <header className="hero-nav" aria-label="Navegación principal">
      <Link href="/" className="brand-link" aria-label="3DCreativeLab, inicio"><CubeMark /><span>3DCreativeLab</span></Link>
      <nav className="nav-links" aria-label="Secciones principales">
        <Link href="/productos">Productos</Link>
        <Link href="/personalizados">Personalizados</Link>
        <Link href="/#fabricacion">Cómo fabricamos</Link>
      </nav>
      <div className="nav-actions"><a className="whatsapp-nav" href="https://wa.me/573024468132" target="_blank" rel="noreferrer">WhatsApp</a>{session ? <AccountMenu isAdmin={isAdminSession(session)} /> : <div className="auth-nav-links"><Link href="/iniciar-sesion">Iniciar sesión</Link><Link href="/registrarse">Registrarse</Link></div>}</div>
    </header>
  );
}

