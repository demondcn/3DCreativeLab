export function passwordValidationError(password: string, confirmation: string) {
  if (password.length < 12) return "La contraseña debe tener al menos 12 caracteres.";
  if (password.length > 128) return "La contraseña no puede superar 128 caracteres.";
  if (!/\p{L}/u.test(password) || !/\p{N}/u.test(password)) return "Incluye al menos una letra y un número.";
  if (password !== confirmation) return "Las contraseñas no coinciden.";
  return "";
}

export function registrationValidationError(name: string, email: string, password: string, confirmation: string) {
  const cleanName = name.trim();
  if (cleanName.length < 2) return "Escribe un nombre de al menos 2 caracteres.";
  if (cleanName.length > 80) return "El nombre no puede superar 80 caracteres.";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Escribe un correo electrónico válido.";
  return passwordValidationError(password, confirmation);
}
