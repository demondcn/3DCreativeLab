import { describe, expect, it } from "vitest";
import { authCallbackUrl, configuredSiteUrl } from "../lib/site-url";

describe("configuredSiteUrl", () => {
  it("acepta localhost durante el desarrollo", () => {
    expect(configuredSiteUrl({ NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3001" })).toBe("http://127.0.0.1:3001");
  });

  it("exige el dominio oficial en producción", () => {
    expect(configuredSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://3dcreativelab.vercel.app", VERCEL_ENV: "production" })).toBe("https://3dcreativelab.vercel.app");
    expect(() => configuredSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://otro.example", VERCEL_ENV: "production" })).toThrow(/producción/);
  });

  it("rechaza rutas y credenciales", () => {
    expect(() => configuredSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://example.com/otra-ruta" })).toThrow(/origen/);
    expect(() => configuredSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://usuario:clave@example.com" })).toThrow(/origen/);
  });
});

describe("authCallbackUrl", () => {
  it("construye callbacks únicamente desde el origen configurado", () => {
    expect(authCallbackUrl("https://3dcreativelab.vercel.app", "/restablecer-contrasena")).toBe("https://3dcreativelab.vercel.app/restablecer-contrasena");
    expect(() => authCallbackUrl("https://3dcreativelab.vercel.app", "//otro.example")).toThrow(/ruta/);
  });
});
