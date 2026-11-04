import { Pool } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const baseUrl = process.env.E2E_BASE_URL || "http://localhost:3001";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const slug = `codex-public-${Date.now()}`;
let id;

try {
  id = (await pool.query(`INSERT INTO products
    (name, slug, description, category, product_type, price, stock, production_hours, shipping_days, status, image_url, image_urls, featured, active)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id::text`,
    ["Producto E2E temporal", slug, "Producto temporal para comprobar el catálogo público.", "Pruebas", "Temporal", 12000, 3, 2, 2, "disponible", "", [], false, true])).rows[0].id;

  const catalogHtml = await (await fetch(`${baseUrl}/productos`, { cache: "no-store" })).text();
  const detailResponse = await fetch(`${baseUrl}/productos/${slug}`, { cache: "no-store" });
  const detailHtml = await detailResponse.text();
  const catalogVisible = catalogHtml.includes("Producto E2E temporal");
  const detailVisible = detailResponse.status === 200 && detailHtml.includes("Producto E2E temporal");
  const initialPriceVisible = detailHtml.includes("12.000");
  const visible = catalogVisible && detailVisible && initialPriceVisible;

  await pool.query("UPDATE products SET name=$1, price=$2, stock=$3 WHERE id=$4::uuid", ["Producto E2E editado", 22000, 7, id]);
  const editedHtml = await (await fetch(`${baseUrl}/productos/${slug}`, { cache: "no-store" })).text();
  const editedNameVisible = editedHtml.includes("Producto E2E editado");
  const editedPriceVisible = editedHtml.includes("22.000");
  const editedStockVisible = editedHtml.includes(">7<");
  const edited = editedNameVisible && editedPriceVisible && editedStockVisible;

  await pool.query("UPDATE products SET active=false WHERE id=$1::uuid", [id]);
  const hiddenCatalog = await (await fetch(`${baseUrl}/productos`, { cache: "no-store" })).text();
  const hiddenDetail = await fetch(`${baseUrl}/productos/${slug}`, { cache: "no-store", redirect: "manual" });
  const hiddenDetailHtml = await hiddenDetail.text();
  const hiddenCatalogClean = !hiddenCatalog.includes("Producto E2E editado");
  const hiddenDetailBlocked = !hiddenDetailHtml.includes("Producto E2E editado") && hiddenDetailHtml.includes("Pieza fuera de línea");
  const hidden = hiddenCatalogClean && hiddenDetailBlocked;

  await pool.query("UPDATE products SET active=true WHERE id=$1::uuid", [id]);
  const restored = (await (await fetch(`${baseUrl}/productos`, { cache: "no-store" })).text()).includes("Producto E2E editado");

  await pool.query("DELETE FROM products WHERE id=$1::uuid", [id]);
  id = undefined;
  const deleted = !(await (await fetch(`${baseUrl}/productos`, { cache: "no-store" })).text()).includes("Producto E2E editado");

  const results = { visible, edited, hidden, restored, deleted, checks: { catalogVisible, detailVisible, initialPriceVisible, editedNameVisible, editedPriceVisible, editedStockVisible, hiddenCatalogClean, hiddenDetailBlocked } };
  console.log(JSON.stringify(results));
  if (![visible, edited, hidden, restored, deleted].every(Boolean)) process.exitCode = 1;
} finally {
  if (id) await pool.query("DELETE FROM products WHERE id=$1::uuid", [id]);
  await pool.end();
}
