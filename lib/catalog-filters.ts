import type { Product } from "./types";

export type CatalogFilters = { query: string; category: string; productType: string; tag: string; minPrice?: number; maxPrice?: number; order: string };

export function filterProducts(products: Product[], filters: CatalogFilters) {
  const normalized = filters.query.trim().toLocaleLowerCase("es");
  return products
    .filter((item) => filters.category === "Todas" || item.category === filters.category)
    .filter((item) => filters.productType === "Todos" || item.product_type === filters.productType)
    .filter((item) => filters.tag === "Todas" || item.tags.includes(filters.tag))
    .filter((item) => filters.minPrice === undefined || item.price >= filters.minPrice)
    .filter((item) => filters.maxPrice === undefined || item.price <= filters.maxPrice)
    .filter((item) => !normalized || `${item.name} ${item.description} ${item.tags.join(" ")}`.toLocaleLowerCase("es").includes(normalized))
    .toSorted((a, b) => filters.order === "price-asc" ? a.price - b.price : filters.order === "price-desc" ? b.price - a.price : filters.order === "name" ? a.name.localeCompare(b.name, "es") : 0);
}
