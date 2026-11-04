export function passwordValidationError(password: string, confirmation: string) {
  if (password.length < 12) return "La contraseña debe tener al menos 12 caracteres.";
  if (password.length > 128) return "La contraseña no puede superar 128 caracteres.";
  if (!/\p{L}/u.test(password) || !/\p{N}/u.test(password)) return "Incluye al menos una letra y un número.";
  if (password !== confirmation) return "Las contraseñas no coinciden.";
  return "";
}
