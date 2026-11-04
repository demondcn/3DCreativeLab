"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";

export function VerificationButton({ email, callbackUrl }: { email: string; callbackUrl: string }) {
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function send() {
    setPending(true);
    setError("");
    try {
      const result = await authClient.sendVerificationEmail({ email, callbackURL: callbackUrl });
      if (result.error) throw result.error;
      setSent(true);
    } catch (caught) {
      const failure = caught as { status?: number };
      setError(failure.status === 429 ? "Espera unos minutos antes de solicitar otro correo." : "No pudimos enviar el correo de verificación. Intenta nuevamente.");
    } finally {
      setPending(false);
    }
  }

  if (sent) return <p className="form-success" role="status">Si la dirección admite verificación, recibirás un enlace seguro por correo.</p>;
  return <div className="verification-action"><button className="button-dark" type="button" onClick={send} disabled={pending}>{pending ? "Enviando…" : "Enviar verificación"}</button>{error && <p className="form-error" role="alert">{error}</p>}</div>;
}
