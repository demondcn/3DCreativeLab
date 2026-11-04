import Link from "next/link";
export default function NotFound() { return <main className="page-shell"><div className="empty-state"><h1>404 · Pieza fuera de línea</h1><p>Puede estar inactiva o la dirección cambió.</p><Link className="button-dark" href="/productos">Volver al catálogo</Link></div></main>; }

