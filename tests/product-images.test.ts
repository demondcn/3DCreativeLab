import { describe, expect, it } from "vitest";
import { MAX_IMAGE_BYTES, productImageFiles } from "../lib/product-images";

function dataWith(file: File) { const data = new FormData(); data.append("images", file); return data; }

describe("productImageFiles", () => {
  it("acepta una imagen WebP dentro del límite", () => {
    const files = productImageFiles(dataWith(new File([new Uint8Array(100)], "pieza.webp", { type: "image/webp" })));
    expect(files).toHaveLength(1);
  });

  it("rechaza formatos ejecutables", () => {
    expect(() => productImageFiles(dataWith(new File(["alert(1)"], "ataque.svg", { type: "image/svg+xml" })))).toThrow(/JPG/);
  });

  it("rechaza archivos mayores de 4 MB", () => {
    expect(() => productImageFiles(dataWith(new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], "grande.png", { type: "image/png" })))).toThrow(/4 MB/);
  });
});
