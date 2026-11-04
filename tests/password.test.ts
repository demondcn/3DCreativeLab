import { describe, expect, it } from "vitest";
import { passwordValidationError, registrationValidationError } from "../lib/auth/password";

describe("passwordValidationError", () => {
  it("acepta una contraseña larga con letras y números", () => {
    expect(passwordValidationError("TallerSeguro2026", "TallerSeguro2026")).toBe("");
  });

  it("rechaza una contraseña corta", () => {
    expect(passwordValidationError("Clave2026", "Clave2026")).toMatch(/12 caracteres/);
  });

  it("exige letras y números", () => {
    expect(passwordValidationError("solo-letras-seguras", "solo-letras-seguras")).toMatch(/letra y un número/);
  });

  it("rechaza confirmaciones distintas", () => {
    expect(passwordValidationError("TallerSeguro2026", "TallerSeguro2027")).toMatch(/no coinciden/);
  });
});

describe("registrationValidationError", () => {
  it("acepta los campos válidos sin recibir roles", () => {
    expect(registrationValidationError("Ana Gómez", "ana@example.com", "TallerSeguro2026", "TallerSeguro2026")).toBe("");
  });

  it("rechaza nombres y correos inválidos", () => {
    expect(registrationValidationError("A", "correo-invalido", "TallerSeguro2026", "TallerSeguro2026")).toMatch(/nombre/);
    expect(registrationValidationError("Ana", "correo-invalido", "TallerSeguro2026", "TallerSeguro2026")).toMatch(/correo/);
  });
});
