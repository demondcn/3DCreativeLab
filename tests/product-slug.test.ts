import { describe, expect, it } from "vitest";
import { productSlug } from "../lib/product-slug";

describe("productSlug", () => {
  it("genera el slug esperado para el ejemplo del formulario", () => {
    expect(productSlug("Squirtle Posa Vasos")).toBe("squirtle-posavasos");
  });

  it("normaliza tildes, símbolos y guiones duplicados", () => {
    expect(productSlug("  Pokémon: Dragón -- edición #2  ")).toBe("pokemon-dragon-edicion-2");
  });
});
