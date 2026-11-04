"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export function LogoutButton({ className = "text-button" }: { className?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try { await authClient.signOut(); } finally {
      router.replace("/");
      router.refresh();
      setPending(false);
    }
  }

  return <button className={className} type="button" onClick={logout} disabled={pending}>{pending ? "Cerrando…" : "Cerrar sesión"}</button>;
}
