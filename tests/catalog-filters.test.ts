import { describe, expect, it } from "vitest";
import { filterProducts } from "../lib/catalog-filters";
import { demoProducts } from "../lib/demo-products";

const base = { query: "", category: "Todas", productType: "Todos", tag: "Todas", order: "recent" };

describe("filterProducts", () => {
  it("combina categoría, tipo y etiqueta sin duplicar productos", () => {
    const result = filterProducts(demoProducts, { ...base, category: "Figuras", productType: "Juguete", tag: "Articulados" });
    expect(result.map((item) => item.slug)).toEqual(["dinosaurio-articulado"]);
  });

  it("filtra por rango de precio", () => {
    const result = filterProducts(demoProducts, { ...base, minPrice: 20000, maxPrice: 35000 });
    expect(result.map((item) => item.price)).toEqual(expect.arrayContaining([25000, 35000]));
    expect(result.every((item) => item.price >= 20000 && item.price <= 35000)).toBe(true);
  });

  it("incluye etiquetas en la búsqueda", () => {
    expect(filterProducts(demoProducts, { ...base, query: "coleccionables" })).toHaveLength(1);
  });
});
