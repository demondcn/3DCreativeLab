import { Pool } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const slug = `codex-smoke-${Date.now()}`;
let id;

try {
  const inserted = await pool.query(`INSERT INTO products
    (name, slug, description, category, product_type, price, stock, production_hours, shipping_days, status, image_url, image_urls, makerworld_url, featured, active)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
    RETURNING id::text, slug, active`, [
      "Producto de prueba temporal", slug, "Registro temporal para verificar el CRUD real de Neon.", "Pruebas", "Temporal",
      12345, 3, 2, 4, "disponible", "", [], "", false, false,
    ]);
  id = inserted.rows[0].id;
  const created = inserted.rows[0].slug === slug && inserted.rows[0].active === false;

  await pool.query("UPDATE products SET name=$1, price=$2, stock=$3, active=true WHERE id=$4::uuid", ["Producto temporal editado", 23456, 5, id]);
  const updatedRow = (await pool.query("SELECT name, price, stock, active FROM products WHERE id=$1::uuid", [id])).rows[0];
  const updated = updatedRow?.name === "Producto temporal editado" && updatedRow?.price === 23456 && updatedRow?.stock === 5 && updatedRow?.active === true;

  await pool.query("UPDATE products SET active=false WHERE id=$1::uuid", [id]);
  const hidden = (await pool.query("SELECT active FROM products WHERE id=$1::uuid", [id])).rows[0]?.active === false;

  await pool.query("DELETE FROM products WHERE id=$1::uuid", [id]);
  id = undefined;
  const deleted = Number((await pool.query("SELECT count(*)::int AS count FROM products WHERE slug=$1", [slug])).rows[0].count) === 0;

  let negativeRejected = false;
  try {
    await pool.query("INSERT INTO products (name, slug, description, category, product_type, price, stock, production_hours, shipping_days) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)", ["Inválido temporal", `${slug}-invalid`, "Registro que debe ser rechazado por las restricciones.", "Pruebas", "Temporal", -1, -1, 1, 1]);
  } catch (error) {
    negativeRejected = error?.code === "23514";
  }

  console.log(JSON.stringify({ created, updated, hidden, deleted, negativeRejected }));
  if (![created, updated, hidden, deleted, negativeRejected].every(Boolean)) process.exitCode = 1;
} finally {
  if (id) await pool.query("DELETE FROM products WHERE id=$1::uuid", [id]);
  await pool.end();
}
