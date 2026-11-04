"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";

export type LoginState = { error: string };
export async function signIn(_previous: LoginState, formData: FormData): Promise<LoginState> {
  if (!auth) return { error: "Configura Neon Auth antes de iniciar sesión." };
  const email = String(formData.get("email") || "").trim().toLocaleLowerCase("en");
  const password = String(formData.get("password") || "");
  if (!email || password.length < 8) return { error: "Escribe un correo y una contraseña válidos." };
  if (!process.env.ADMIN_EMAIL || email !== process.env.ADMIN_EMAIL.trim().toLocaleLowerCase("en")) return { error: "Esta cuenta no está autorizada para administrar la tienda." };
  const { error } = await auth.signIn.email({ email, password });
  if (error) return { error: error.message || "No fue posible iniciar sesión." };
  redirect("/admin");
}

