"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { EmailVerificationForm } from "@/components/email-verification-form";

type AuthFailure = {
  status?: number;
  code?: string;
  error?: { status?: number; code?: string };
};

export function LoginForm({ forgotHref, successHref, verificationCallbackUrl }: { forgotHref: string; successHref: string; verificationCallbackUrl: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setVerificationEmail("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    try {
      const result = await authClient.signIn.email({
        email,
        password: String(form.get("password") || ""),
      });
      if (result.error) throw result.error;
      router.replace(successHref);
      router.refresh();
    } catch (caught) {
      const failure = caught as AuthFailure;
      const status = failure.error?.status ?? failure.status;
      const code = failure.error?.code ?? failure.code;
      if (status === 403 || code === "EMAIL_NOT_VERIFIED") {
        setError("Debes verificar tu correo antes de iniciar sesión.");
        setVerificationEmail(email);
      }
      else if (status === 429) setError("Hay demasiados intentos. Espera unos minutos y vuelve a intentarlo.");
      else if (status === 401 || code === "INVALID_EMAIL_OR_PASSWORD") setError("Correo o contraseña incorrectos.");
      else setError("No fue posible conectar con el servicio de acceso. Intenta nuevamente.");
    } finally {
      setPending(false);
    }
  }

  if (verificationEmail) return <EmailVerificationForm email={verificationEmail} callbackUrl={verificationCallbackUrl} successHref={successHref} onCancel={() => setVerificationEmail("")} />;
  return <form className="admin-form login-form" onSubmit={submit}><label>Correo electrónico<input name="email" type="email" autoComplete="email" maxLength={254} required /></label><label>Contraseña<input name="password" type="password" autoComplete="current-password" minLength={8} maxLength={128} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button-light" disabled={pending}>{pending ? "Verificando…" : "Iniciar sesión"}</button><Link className="auth-link" href={forgotHref}>¿Olvidaste tu contraseña?</Link></form>;
}
