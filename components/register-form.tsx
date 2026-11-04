"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { registrationValidationError } from "@/lib/auth/password";

const duplicateCodes = new Set(["USER_ALREADY_EXISTS", "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"]);

export function RegisterForm({ verificationCallbackUrl }: { verificationCallbackUrl: string }) {
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim().toLocaleLowerCase("en");
    const password = String(form.get("password") || "");
    const validationError = registrationValidationError(name, email, password, String(form.get("confirmation") || ""));
    if (validationError) return setError(validationError);

    setPending(true);
    setError("");
    try {
      const result = await authClient.signUp.email({ name, email, password, callbackURL: verificationCallbackUrl });
      if (result.error) {
        if (duplicateCodes.has(result.error.code || "")) return setComplete(true);
        throw result.error;
      }
      setComplete(true);
    } catch (caught) {
      const failure = caught as { status?: number; code?: string };
      if (duplicateCodes.has(failure.code || "")) setComplete(true);
      else if (failure.status === 429) setError("Hay demasiadas solicitudes. Espera unos minutos y vuelve a intentarlo.");
      else setError("No pudimos completar el registro. Revisa los datos e intenta nuevamente.");
    } finally {
      setPending(false);
    }
  }

  if (complete) return <div className="admin-form login-form"><p className="form-success" role="status">Si el registro puede completarse, recibirás un enlace para verificar tu correo. Revisa también la carpeta de correo no deseado.</p><Link className="button-light" href="/iniciar-sesion">Ir a iniciar sesión</Link></div>;
  return <form className="admin-form login-form" onSubmit={submit}><label>Nombre<input name="name" autoComplete="name" minLength={2} maxLength={80} required /></label><label>Correo electrónico<input name="email" type="email" autoComplete="email" maxLength={254} required /></label><label>Contraseña<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} aria-describedby="register-password-help" required /></label><p className="field-help" id="register-password-help">Usa entre 12 y 128 caracteres, con al menos una letra y un número.</p><label>Confirmar contraseña<input name="confirmation" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /></label><p className="field-help">Las condiciones de uso y la política de privacidad aún no están publicadas; no solicitamos una aceptación inexistente.</p>{error && <p className="form-error" role="alert">{error}</p>}<button className="button-light" disabled={pending}>{pending ? "Creando cuenta…" : "Crear cuenta"}</button><Link className="auth-link" href="/iniciar-sesion">Ya tengo una cuenta</Link></form>;
}
