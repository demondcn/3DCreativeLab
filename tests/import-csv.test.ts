import { describe, expect, it } from "vitest";
import { normalizedProductKey, parseCsv } from "../lib/import-csv.mjs";

describe("parseCsv", () => {
  it("conserva comas y JSON entre comillas", () => {
    const [row] = parseCsv('name,tags,price\n"Pieza, grande","[""Anime"", ""Geek""]",20000\n');
    expect(row).toEqual({ name: "Pieza, grande", tags: '["Anime", "Geek"]', price: "20000" });
  });

  it("rechaza filas incompletas", () => {
    expect(() => parseCsv("name,price\nPieza\n")).toThrow("se esperaban 2");
  });

  it("acepta el BOM UTF-8 del archivo de importación", () => {
    expect(parseCsv("\uFEFFexternal_id,name\n3DCL-0001,Pieza\n")[0]).toEqual({ external_id: "3DCL-0001", name: "Pieza" });
  });
});

describe("normalizedProductKey", () => {
  it("compara nombre y categoría sin diferencias de tildes o mayúsculas", () => {
    expect(normalizedProductKey("  Pokémon Ágil ", "FIGURAS")).toBe(normalizedProductKey("pokemon agil", "figuras"));
  });
});
