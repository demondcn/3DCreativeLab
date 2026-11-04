import { ResetPasswordForm } from "@/components/reset-password-form";
import { SiteHeader } from "@/components/site-header";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; error?: string }> }) {
  const { token, error } = await searchParams;
  return <><SiteHeader /><main className="admin-login auth-screen"><div><h1>Nueva contraseña</h1><p>El enlace solo puede usarse una vez y vence después de 15 minutos.</p></div><ResetPasswordForm token={token} invalid={Boolean(error)} /></main></>;
}
