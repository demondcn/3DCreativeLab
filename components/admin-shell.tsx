"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/" className="admin-brand">3DCreativeLab</Link><span>Administración</span><nav><Link href="/admin">Resumen</Link><Link href="/admin/productos">Productos</Link><Link href="/admin/productos/nuevo">Nuevo producto</Link><Link href="/productos">Ver tienda</Link></nav><form action={logout}><button className="text-button">Cerrar sesión</button></form></aside><main className="admin-main">{children}</main></div>;
}
