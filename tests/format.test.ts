import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, formatCOP, productWhatsAppUrl } from "../lib/format";
import { demoProducts } from "../lib/demo-products";

describe("formatCOP", () => {
  it("formatea precios en pesos colombianos sin decimales", () => {
    expect(formatCOP(25000)).toMatch(/25[.\s]000/);
    expect(formatCOP(25000)).toContain("$");
  });
});

describe("WhatsApp", () => {
  it("usa el número aprobado y codifica el mensaje", () => {
    const url = buildWhatsAppUrl("Pieza 10 × 20");
    expect(url.startsWith("https://wa.me/573024468132?text=")).toBe(true);
    expect(decodeURIComponent(url)).toContain("Pieza 10 × 20");
  });

  it("incluye producto, cantidad, precio y referencia", () => {
    const url = decodeURIComponent(productWhatsAppUrl(demoProducts[0], 3));
    expect(url).toContain("3 × Maceta facetada");
    expect(url).toContain("maceta-facetada");
    expect(url).toMatch(/25[.\s]000/);
    expect(url).toMatch(/75[.\s]000/);
    expect(url).toContain("confirma disponibilidad");
  });
});

