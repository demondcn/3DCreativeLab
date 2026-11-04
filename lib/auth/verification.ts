export function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return "correo registrado";
  const visible = local.length > 2 ? `${local[0]}${"*".repeat(Math.min(local.length - 2, 4))}${local.at(-1)}` : `${local[0]}***`;
  return `${visible}@${domain}`;
}

export function verificationCodeError(code: string) {
  return /^\d{6}$/.test(code) ? "" : "Escribe los seis dígitos del código.";
}
