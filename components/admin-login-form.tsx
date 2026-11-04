"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = { error: "" };
export function AdminLoginForm() {
  const [state, action, pending] = useActionState(signIn, initialState);
  return <form className="admin-form login-form" action={action}><label>Correo administrativo<input name="email" type="email" autoComplete="email" required /></label><label>Contraseña<input name="password" type="password" autoComplete="current-password" minLength={8} required /></label>{state.error && <p className="form-error" role="alert">{state.error}</p>}<button className="button-light" disabled={pending}>{pending ? "Verificando…" : "Ingresar"}</button></form>;
}

