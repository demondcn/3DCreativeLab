"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { passwordValidationError } from "@/lib/auth/password";

export function ResetPasswordForm({ token, invalid, loginHref = "/iniciar-sesion", recoveryHref = "/recuperar-contrasena" }: { token?: string; invalid: boolean; loginHref?: string; recoveryHref?: string }) {
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const validationError = passwordValidationError(password, String(form.get("confirmation") || ""));
    if (validationError) return setError(validationError);
    setPending(true);
    setError("");
    try {
      const result = await authClient.resetPassword({ newPassword: password, token });
      if (result.error) {
        setError("El enlace es inválido o venció. Solicita uno nuevo.");
        return;
      }
      setComplete(true);
    } catch (caught) {
      const failure = caught as { status?: number; code?: string };
      setError(failure.status === 400 || failure.code === "INVALID_TOKEN"
        ? "El enlace es inválido o venció. Solicita uno nuevo."
        : "No pudimos conectar con el servicio de acceso. Intenta nuevamente.");
    } finally {
      setPending(false);
    }
  }

  if (complete) return <div className="admin-form login-form"><p className="form-success" role="status">Tu contraseña fue actualizada. Ya puedes iniciar sesión.</p><Link className="button-light" href={loginHref}>Iniciar sesión</Link></div>;
  if (invalid || !token) return <div className="admin-form login-form"><p className="form-error" role="alert">El enlace es inválido o venció.</p><Link className="button-light" href={recoveryHref}>Solicitar otro enlace</Link></div>;
  return <form className="admin-form login-form" onSubmit={submit}><label>Nueva contraseña<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} aria-describedby="password-help" required /></label><p className="field-help" id="password-help">Usa entre 12 y 128 caracteres, con al menos una letra y un número.</p><label>Confirmar contraseña<input name="confirmation" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button-light" disabled={pending}>{pending ? "Actualizando…" : "Guardar contraseña"}</button></form>;
}
