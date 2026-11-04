import { describe, expect, it } from "vitest";
import { normalizeProductTags } from "../lib/product-tags";

describe("normalizeProductTags", () => {
  it("limpia y elimina duplicados sin perder varias etiquetas", () => {
    expect(normalizeProductTags([" Anime ", "Geek", "anime", "Video   juegos"])).toEqual(["Anime", "Geek", "Video juegos"]);
  });

  it("limita la cantidad persistida", () => {
    expect(normalizeProductTags(Array.from({ length: 15 }, (_, index) => `Etiqueta ${index}`))).toHaveLength(12);
  });
});
