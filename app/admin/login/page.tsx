import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { SiteHeader } from "@/components/site-header";
import { getAdminSession } from "@/lib/auth/server";
export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <><SiteHeader /><main className="admin-login"><div><span className="admin-context">Acceso restringido</span><h1>Panel de inspección</h1><p>Gestiona catálogo, visibilidad e inventario desde una sesión protegida por Neon Auth.</p></div><AdminLoginForm /></main></>;
}

