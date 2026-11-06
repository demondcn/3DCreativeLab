import { productStatus } from "./format";
import type { Product } from "./types";

export type AdminProductFilters = {
  price: "all" | "up-to-10000" | "10001-20000" | "20001-35000" | "above-35000";
  status: "all" | Product["status"];
  stock: "all" | "zero" | "one" | "two-plus";
  visible: "all" | "yes" | "no";
  makerworld: "all" | "with" | "without";
  sort: "none" | "price-asc" | "price-desc" | "stock-asc" | "stock-desc";
};

export const defaultAdminProductFilters: AdminProductFilters = {
  price: "all",
  status: "all",
  stock: "all",
  visible: "all",
  makerworld: "all",
  sort: "none",
};

const options = {
  price: ["all", "up-to-10000", "10001-20000", "20001-35000", "above-35000"],
  status: ["all", "disponible", "bajo_pedido", "agotado"],
  stock: ["all", "zero", "one", "two-plus"],
  visible: ["all", "yes", "no"],
  makerworld: ["all", "with", "without"],
  sort: ["none", "price-asc", "price-desc", "stock-asc", "stock-desc"],
} as const;

type SearchValues = Record<string, string | string[] | undefined>;

export function parseAdminProductFilters(values: SearchValues): AdminProductFilters {
  return Object.fromEntries(
    Object.entries(defaultAdminProductFilters).map(([key, fallback]) => {
      const value = values[key];
      return [key, typeof value === "string" && (options[key as keyof typeof options] as readonly string[]).includes(value) ? value : fallback];
    }),
  ) as AdminProductFilters;
}

export function validMakerWorldUrl(value: string | null | undefined) {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    if ((url.protocol !== "https:" && url.protocol !== "http:") || (host !== "makerworld.com" && !host.endsWith(".makerworld.com"))) return null;
    return url.toString();
  } catch {
    return null;
  }
}

function isInPriceRange(price: number, range: AdminProductFilters["price"]) {
  if (range === "up-to-10000") return price <= 10_000;
  if (range === "10001-20000") return price > 10_000 && price <= 20_000;
  if (range === "20001-35000") return price > 20_000 && price <= 35_000;
  if (range === "above-35000") return price > 35_000;
  return true;
}

export function filterAdminProducts(products: Product[], filters: AdminProductFilters) {
  const filtered = products.filter((product) => {
    if (!isInPriceRange(product.price, filters.price)) return false;
    if (filters.status !== "all") {
      const displayedStatus = productStatus(product).toLowerCase().replace(" ", "_");
      if (displayedStatus !== filters.status) return false;
    }
    if (filters.stock === "zero" && product.stock !== 0) return false;
    if (filters.stock === "one" && product.stock !== 1) return false;
    if (filters.stock === "two-plus" && product.stock < 2) return false;
    if (filters.visible === "yes" && !product.active) return false;
    if (filters.visible === "no" && product.active) return false;
    const hasMakerWorld = Boolean(validMakerWorldUrl(product.makerworld_url));
    if (filters.makerworld === "with" && !hasMakerWorld) return false;
    if (filters.makerworld === "without" && hasMakerWorld) return false;
    return true;
  });

  if (filters.sort === "none") return filtered;
  const direction = filters.sort.endsWith("desc") ? -1 : 1;
  const field = filters.sort.startsWith("price") ? "price" : "stock";
  return filtered.sort((a, b) => (a[field] - b[field]) * direction);
}
