import { describe, expect, it } from "vitest";
import { productSchema } from "../lib/product-schema";

const validProduct = {
  name: "Soporte técnico",
  slug: "soporte-tecnico",
  description: "Una descripción suficientemente completa.",
  category: "Repuestos",
  product_type: "Pieza funcional",
  tags: ["Geek", "Personalizados"],
  price: 25000,
  stock: 2,
  production_hours: 3,
  shipping_days: 2,
  status: "disponible",
  image_urls: [],
  makerworld_url: "",
  featured: false,
  active: true,
};

describe("productSchema", () => {
  it("acepta un producto válido", () => expect(productSchema.safeParse(validProduct).success).toBe(true));
  it("rechaza precio negativo", () => expect(productSchema.safeParse({ ...validProduct, price: -1 }).success).toBe(false));
  it("rechaza inventario negativo", () => expect(productSchema.safeParse({ ...validProduct, stock: -1 }).success).toBe(false));
  it("rechaza tiempos de envío inválidos", () => expect(productSchema.safeParse({ ...validProduct, shipping_days: 0 }).success).toBe(false));
  it("explica los slugs inválidos", () => {
    const result = productSchema.safeParse({ ...validProduct, slug: "../../admin" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.message).toBe("El slug solo puede usar letras minúsculas, números y guiones simples.");
  });
});
