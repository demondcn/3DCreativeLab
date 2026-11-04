import Link from "next/link";
import { CubeMark } from "./cube-mark";

export function SiteHeader() {
  return (
    <header className="hero-nav" aria-label="Navegación principal">
      <Link href="/" className="brand-link" aria-label="3DCreativeLab, inicio"><CubeMark /><span>3DCreativeLab</span></Link>
      <nav className="nav-links" aria-label="Secciones principales">
        <Link href="/productos">Productos</Link>
        <Link href="/personalizados">Personalizados</Link>
        <Link href="/#fabricacion">Cómo fabricamos</Link>
      </nav>
      <a className="whatsapp-nav" href="https://wa.me/573024468132" target="_blank" rel="noreferrer">WhatsApp</a>
    </header>
  );
}

