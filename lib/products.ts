import { demoProducts } from "./demo-products";
import { db, hasDatabaseEnv } from "./neon";
import type { Product } from "./types";

export async function getProducts(options: { featured?: boolean; includeInactive?: boolean } = {}) {
  if (!hasDatabaseEnv()) {
    if (process.env.NODE_ENV === "production") throw new Error("La conexión con Neon no está configurada.");
    return options.featured ? demoProducts.filter((item) => item.featured) : demoProducts;
  }
  const sql = db();
  const rows = await sql`SELECT id::text, name, slug, description, category, product_type, price, stock, production_hours, shipping_days, status, image_url, image_urls, makerworld_url, featured, active, created_at::text, updated_at::text FROM products ORDER BY created_at DESC` as Product[];
  return rows.filter((item) => (options.includeInactive || item.active) && (!options.featured || item.featured));
}

export async function getProductBySlug(slug: string) {
  if (!hasDatabaseEnv()) {
    if (process.env.NODE_ENV === "production") throw new Error("La conexión con Neon no está configurada.");
    return demoProducts.find((item) => item.slug === slug) ?? null;
  }
  const sql = db();
  const rows = await sql`SELECT id::text, name, slug, description, category, product_type, price, stock, production_hours, shipping_days, status, image_url, image_urls, makerworld_url, featured, active, created_at::text, updated_at::text FROM products WHERE slug = ${slug} AND active = true LIMIT 1` as Product[];
  return rows[0] ?? null;
}

export async function getProductById(id: string) {
  if (!hasDatabaseEnv()) {
    if (process.env.NODE_ENV === "production") throw new Error("La conexión con Neon no está configurada.");
    return demoProducts.find((item) => item.id === id) ?? null;
  }
  const sql = db();
  const rows = await sql`SELECT id::text, name, slug, description, category, product_type, price, stock, production_hours, shipping_days, status, image_url, image_urls, makerworld_url, featured, active, created_at::text, updated_at::text FROM products WHERE id = ${id}::uuid LIMIT 1` as Product[];
  return rows[0] ?? null;
}

