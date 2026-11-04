"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export function AccountMenu({ isAdmin }: { isAdmin: boolean }) {
  return <details className="account-menu"><summary>Cuenta</summary><div className="account-menu-panel"><Link href="/cuenta">Mi cuenta</Link>{isAdmin && <Link href="/admin">Panel administrativo</Link>}<LogoutButton /></div></details>;
}
