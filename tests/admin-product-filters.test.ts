import { describe, expect, it } from "vitest";
import {
  defaultAdminProductFilters,
  filterAdminProducts,
  parseAdminProductFilters,
  validMakerWorldUrl,
  type AdminProductFilters,
} from "../lib/admin-product-filters";
import type { Product } from "../lib/types";

function product(overrides: Partial<Product> & Pick<Product, "id">): Product {
  return {
    name: `Producto ${overrides.id}`,
    slug: `producto-${overrides.id}`,
    description: "",
    category: "Figuras",
    product_type: "Figura",
    tags: [],
    price: 20_000,
    stock: 2,
    production_hours: 24,
    shipping_days: 2,
    status: "disponible",
    image_url: "",
    image_urls: [],
    makerworld_url: null,
    featured: false,
    active: true,
    ...overrides,
  };
}

const products = [
  product({ id: "a", price: 8_000, stock: 0, status: "agotado", active: false }),
  product({ id: "b", price: 20_000, stock: 1, status: "bajo_pedido", active: false }),
  product({ id: "c", price: 35_000, stock: 4, makerworld_url: "https://makerworld.com/es/models/123" }),
  product({ id: "d", price: 40_000, stock: 2, makerworld_url: "https://makerworld.example/modelo" }),
];

function filters(overrides: Partial<AdminProductFilters> = {}) {
  return { ...defaultAdminProductFilters, ...overrides };
}

describe("validMakerWorldUrl", () => {
  it("acepta únicamente URL web del dominio MakerWorld", () => {
    expect(validMakerWorldUrl("https://makerworld.com/es/models/123")).toContain("makerworld.com/es/models/123");
    expect(validMakerWorldUrl("https://www.makerworld.com/model/1")).toBeTruthy();
    expect(validMakerWorldUrl("javascript:alert(1)")).toBeNull();
    expect(validMakerWorldUrl("https://makerworld.com.ejemplo.com/model/1")).toBeNull();
    expect(validMakerWorldUrl(" ")).toBeNull();
  });
});

describe("filterAdminProducts", () => {
  it("aplica los filtros individuales", () => {
    expect(filterAdminProducts(products, filters({ price: "up-to-10000" })).map((item) => item.id)).toEqual(["a"]);
    expect(filterAdminProducts(products, filters({ status: "bajo_pedido" })).map((item) => item.id)).toEqual(["b"]);
    expect(filterAdminProducts(products, filters({ stock: "two-plus" })).map((item) => item.id)).toEqual(["c", "d"]);
    expect(filterAdminProducts(products, filters({ visible: "yes" })).map((item) => item.id)).toEqual(["c", "d"]);
    expect(filterAdminProducts(products, filters({ makerworld: "with" })).map((item) => item.id)).toEqual(["c"]);
  });

  it("combina ocultos, inventario de una unidad y sin MakerWorld", () => {
    expect(filterAdminProducts(products, filters({ visible: "no", stock: "one", makerworld: "without" })).map((item) => item.id)).toEqual(["b"]);
  });

  it("ordena por precio e inventario en ambas direcciones", () => {
    expect(filterAdminProducts(products, filters({ sort: "price-desc" })).map((item) => item.price)).toEqual([40_000, 35_000, 20_000, 8_000]);
    expect(filterAdminProducts(products, filters({ sort: "stock-asc" })).map((item) => item.stock)).toEqual([0, 1, 2, 4]);
  });

  it("filtra el conjunto completo de 423 productos", () => {
    const catalog = Array.from({ length: 423 }, (_, index) => product({ id: String(index), active: index % 2 === 0, stock: index % 3 }));
    const result = filterAdminProducts(catalog, filters({ visible: "no", stock: "one" }));
    expect(result).toHaveLength(catalog.filter((item) => !item.active && item.stock === 1).length);
  });
});

describe("parseAdminProductFilters", () => {
  it("conserva valores válidos de la URL y descarta los manipulados", () => {
    expect(parseAdminProductFilters({ visible: "no", sort: "stock-desc", price: "invalido" })).toEqual(filters({ visible: "no", sort: "stock-desc" }));
  });
});
