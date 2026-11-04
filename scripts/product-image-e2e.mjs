import { readFile } from "node:fs/promises";
import { Pool } from "@neondatabase/serverless";
import { del, put } from "@vercel/blob";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN is required.");

const baseUrl = process.env.E2E_BASE_URL || "http://localhost:3001";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const slug = `codex-image-${Date.now()}`;
let id;
let blobUrl;

try {
  const image = await readFile(new URL("../public/images/printer-detail.png", import.meta.url));
  const blob = await put(`products/${slug}/test.png`, image, {
    access: "public",
    addRandomSuffix: false,
    contentType: "image/png",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  blobUrl = blob.url;

  id = (await pool.query(`INSERT INTO products
    (name, slug, description, category, product_type, tags, price, stock, production_hours, shipping_days, status, image_url, image_urls, featured, active)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id::text`,
    ["Producto con imagen E2E", slug, "Producto temporal para verificar Vercel Blob, Neon y la tienda pública.", "Pruebas", "Temporal", ["Geek"], 18000, 1, 2, 2, "disponible", blobUrl, [blobUrl], false, true])).rows[0].id;

  const detailResponse = await fetch(`${baseUrl}/productos/${slug}`, { cache: "no-store" });
  const detailHtml = await detailResponse.text();
  const catalogHtml = await (await fetch(`${baseUrl}/productos`, { cache: "no-store" })).text();
  const blobResponse = await fetch(blobUrl, { cache: "no-store" });
  const saved = detailResponse.status === 200 && detailHtml.includes(blobUrl) && catalogHtml.includes(blobUrl);
  const reachable = blobResponse.ok && blobResponse.headers.get("content-type")?.startsWith("image/") === true;

  console.log(JSON.stringify({ uploaded: true, saved, reachable }));
  if (![saved, reachable].every(Boolean)) process.exitCode = 1;
} finally {
  if (id) await pool.query("DELETE FROM products WHERE id=$1::uuid", [id]);
  if (blobUrl) await del(blobUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
  await pool.end();
}
