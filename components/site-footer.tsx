import Link from "next/link";
import { CubeMark } from "./cube-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand"><CubeMark /><strong>3DCreativeLab</strong></div>
      <p>Impresión 3D profesional en Colombia.</p>
      <nav aria-label="Pie de página">
        <Link href="/productos">Catálogo</Link>
        <Link href="/personalizados">Personalizados</Link>
        <Link href="/admin/login">Administración</Link>
      </nav>
      <small>Los tiempos y precios se confirman antes de fabricar.</small>
    </footer>
  );
}

