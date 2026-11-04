"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  if (["/admin/login", "/admin/forgot-password", "/admin/reset-password"].includes(pathname)) return <>{children}</>;

  async function logout() {
    setPending(true);
    try { await authClient.signOut(); } finally {
      router.replace("/");
      router.refresh();
      setPending(false);
    }
  }

  return <div className="admin-shell"><aside className="admin-sidebar"><Link href="/" className="admin-brand">3DCreativeLab</Link><span>Administración</span><nav><Link href="/admin">Resumen</Link><Link href="/admin/productos">Productos</Link><Link href="/admin/productos/nuevo">Nuevo producto</Link><Link href="/cuenta">Mi cuenta</Link><Link href="/productos">Ver tienda</Link></nav><button className="text-button" type="button" onClick={logout} disabled={pending}>{pending ? "Cerrando…" : "Cerrar sesión"}</button></aside><main className="admin-main">{children}</main></div>;
}
