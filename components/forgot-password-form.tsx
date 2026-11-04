"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await authClient.requestPasswordReset({
        email: String(form.get("email") || "").trim(),
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (result.error) {
        setError("No pudimos procesar la solicitud. Intenta nuevamente.");
        return;
      }
      setSent(true);
    } catch {
      setError("No pudimos conectar con el servicio de acceso. Intenta nuevamente.");
    } finally {
      setPending(false);
    }
  }

  if (sent) return <div className="admin-form login-form"><p className="form-success" role="status">Si el correo corresponde a una cuenta, recibirás un enlace válido durante 15 minutos.</p><Link className="button-light" href="/admin/login">Volver al acceso</Link></div>;
  return <form className="admin-form login-form" onSubmit={submit}><label>Correo administrativo<input name="email" type="email" autoComplete="email" required /></label><p className="field-help">Enviaremos las mismas instrucciones exista o no una cuenta asociada.</p>{error && <p className="form-error" role="alert">{error}</p>}<button className="button-light" disabled={pending}>{pending ? "Enviando…" : "Enviar enlace"}</button><Link className="auth-link" href="/admin/login">Volver al acceso</Link></form>;
}
