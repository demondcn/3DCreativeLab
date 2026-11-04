export function isAdminEmail(email?: string | null, allowedEmail: string | null | undefined = process.env.ADMIN_EMAIL) {
  const allowed = allowedEmail?.trim().toLocaleLowerCase("en");
  return Boolean(allowed && email?.trim().toLocaleLowerCase("en") === allowed);
}
