import { describe, expect, it } from "vitest";
import { catalogClassificationErrors, expectedCatalogPrice } from "../lib/import-catalog-rules.mjs";

describe("expectedCatalogPrice", () => {
  it.each([["Llavero", 8000], ["Arte de pared", 40000], ["Posavasos", 35000], ["Figura", 20000]])("asigna %s a %i COP", (type, price) => {
    expect(expectedCatalogPrice(type)).toBe(price);
  });
});

describe("catalogClassificationErrors", () => {
  it("acepta un clicker como llavero con su etiqueta", () => {
    expect(catalogClassificationErrors({ external_id: "3DCL-0001", product_type: "Llavero", tags: ["Clicker"], price: 8000 })).toEqual([]);
  });

  it("rechaza Otro y un clicker mal clasificado", () => {
    expect(catalogClassificationErrors({ external_id: "3DCL-0001", product_type: "Otro", tags: ["Clicker"], price: 20000 })).toHaveLength(2);
  });
});
