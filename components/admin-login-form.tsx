"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";

export function AdminLoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const result = await authClient.signIn.email({
        email: String(form.get("email") || "").trim(),
        password: String(form.get("password") || ""),
      });
      if (result.error) {
        setError("Correo o contraseña incorrectos.");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch (caught) {
      const failure = caught as { status?: number; code?: string };
      setError(failure.status === 401 || failure.code === "INVALID_EMAIL_OR_PASSWORD"
        ? "Correo o contraseña incorrectos."
        : "No fue posible conectar con el servicio de acceso. Intenta nuevamente.");
    } finally {
      setPending(false);
    }
  }

  return <form className="admin-form login-form" onSubmit={submit}><label>Correo administrativo<input name="email" type="email" autoComplete="email" required /></label><label>Contraseña<input name="password" type="password" autoComplete="current-password" minLength={8} maxLength={128} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button-light" disabled={pending}>{pending ? "Verificando…" : "Ingresar"}</button><Link className="auth-link" href="/admin/forgot-password">¿Olvidaste tu contraseña?</Link></form>;
}

