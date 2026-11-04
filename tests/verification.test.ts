import { describe, expect, it } from "vitest";
import { maskEmail, verificationCodeError } from "../lib/auth/verification";

describe("maskEmail", () => {
  it("oculta parcialmente la parte local", () => {
    expect(maskEmail("cliente1@example.com")).toBe("c****1@example.com");
    expect(maskEmail("a@example.com")).toBe("a***@example.com");
    expect(maskEmail("ab@example.com")).toBe("a***@example.com");
  });

  it("no refleja entradas inválidas", () => {
    expect(maskEmail("correo-invalido")).toBe("correo registrado");
  });
});

describe("verificationCodeError", () => {
  it("acepta únicamente seis dígitos", () => {
    expect(verificationCodeError("123456")).toBe("");
    expect(verificationCodeError("12345")).toMatch(/seis dígitos/);
    expect(verificationCodeError("12345a")).toMatch(/seis dígitos/);
  });
});
