import { describe, expect, it } from "vitest";
import { isAdminEmail } from "../lib/auth/authorization";

describe("isAdminEmail", () => {
  it("autoriza únicamente la identidad configurada", () => {
    expect(isAdminEmail("admin@3dcreativelab.com", "ADMIN@3DCREATIVELAB.COM")).toBe(true);
    expect(isAdminEmail("cliente@3dcreativelab.com", "admin@3dcreativelab.com")).toBe(false);
  });

  it("no autoriza si falta la lista del servidor", () => {
    expect(isAdminEmail("admin@3dcreativelab.com", null)).toBe(false);
  });
});
