"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { maskEmail, verificationCodeError } from "@/lib/auth/verification";

type AuthFailure = { status?: number; code?: string; error?: { status?: number; code?: string } };

function failureDetails(caught: unknown) {
  const failure = caught as AuthFailure;
  return { status: failure.error?.status ?? failure.status, code: failure.error?.code ?? failure.code };
}

export function EmailVerificationForm({ email, callbackUrl, successHref = "/cuenta", onCancel }: { email: string; callbackUrl: string; successHref?: string; onCancel?: () => void }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function verify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationError = verificationCodeError(code);
    if (validationError) return setError(validationError);
    setPending(true);
    setError("");
    setMessage("");
    try {
      const result = await authClient.emailOtp.verifyEmail({ email, otp: code });
      if (result.error) throw result.error;
      const sessionResult = await authClient.getSession();
      if (sessionResult.data?.session) {
        router.replace(successHref);
        router.refresh();
      } else {
        setComplete(true);
      }
    } catch (caught) {
      const { status, code: failureCode } = failureDetails(caught);
      if (status === 429 || failureCode === "TOO_MANY_ATTEMPTS") setError("Alcanzaste el límite de intentos. Espera unos minutos y solicita un código nuevo.");
      else if (failureCode === "OTP_EXPIRED") setError("El código venció. Solicita uno nuevo.");
      else if (failureCode === "INVALID_OTP" || status === 400) setError("El código es incorrecto o ya no es válido.");
      else setError("No fue posible verificar el código. Intenta nuevamente.");
    } finally {
      setPending(false);
    }
  }

  async function resend() {
    setPending(true);
    setError("");
    setMessage("");
    try {
      const result = await authClient.sendVerificationEmail({ email, callbackURL: callbackUrl });
      if (result.error) throw result.error;
      setCode("");
      setMessage("Enviamos un código nuevo. Revisa también la carpeta de correo no deseado.");
    } catch (caught) {
      const { status } = failureDetails(caught);
      setError(status === 429 ? "Espera unos minutos antes de solicitar otro código." : "No fue posible enviar otro código. Intenta nuevamente.");
    } finally {
      setPending(false);
    }
  }

  if (complete) return <div className="admin-form login-form"><p className="form-success" role="status">Tu correo fue verificado correctamente.</p><Link className="button-light" href="/iniciar-sesion">Continuar a iniciar sesión</Link></div>;

  return <form className="admin-form login-form" onSubmit={verify}><p>Ingresa el código numérico de seis dígitos enviado a <strong className="verification-email">{maskEmail(email)}</strong>.</p><label>Código de verificación<input className="otp-input" name="code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength={6} maxLength={6} aria-describedby="verification-code-help" required /></label><p className="field-help" id="verification-code-help">El código vence y tiene un número limitado de intentos.</p>{message && <p className="form-success" role="status">{message}</p>}{error && <p className="form-error" role="alert">{error}</p>}<button className="button-light" disabled={pending}>{pending ? "Verificando…" : "Verificar correo"}</button><div className="verification-links"><button className="text-button auth-link" type="button" onClick={resend} disabled={pending}>Solicitar otro código</button>{onCancel && <button className="text-button auth-link" type="button" onClick={onCancel} disabled={pending}>Volver</button>}</div></form>;
}
