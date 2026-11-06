import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join, resolve, sep } from "node:path";
import { spawnSync } from "node:child_process";
import { Pool } from "@neondatabase/serverless";
import { BlobNotFoundError, del, head, put } from "@vercel/blob";
import { catalogClassificationErrors } from "../lib/import-catalog-rules.mjs";
import { normalizedProductKey, parseCsv } from "../lib/import-csv.mjs";

const REQUIRED_FIELDS = ["external_id", "name", "slug", "description", "category", "product_type", "tags", "price", "stock", "production_hours", "shipping_days", "status", "active", "featured", "photo_file", "commercial_license_status"];
const KNOWN_EXISTING = new Map([["3DCL-0009", "squirtle-posavasos"]]);
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

function option(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function integer(value, field, row) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) throw new Error(`${row.external_id}: ${field} debe ser un entero no negativo.`);
  return parsed;
}

function validateRow(row, extractionRoot) {
  for (const field of REQUIRED_FIELDS) if (!row[field]?.trim()) throw new Error(`${row.external_id || "Fila sin ID"}: falta ${field}.`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug)) throw new Error(`${row.external_id}: slug inválido.`);
  for (const [field, minimum, maximum] of [["name", 3, 100], ["description", 10, 1000], ["category", 2, 60], ["product_type", 2, 60]]) {
    if (row[field].trim().length < minimum || row[field].trim().length > maximum) throw new Error(`${row.external_id}: ${field} debe tener entre ${minimum} y ${maximum} caracteres.`);
  }
  const tags = JSON.parse(row.tags);
  if (!Array.isArray(tags) || tags.length > 12 || tags.some((tag) => typeof tag !== "string" || tag.trim().length < 2 || tag.trim().length > 40)) throw new Error(`${row.external_id}: etiquetas inválidas.`);
  if (!["disponible", "bajo_pedido", "agotado"].includes(row.status)) throw new Error(`${row.external_id}: estado inválido.`);
  if (row.active !== "false" || row.featured !== "false") throw new Error(`${row.external_id}: todos los productos deben iniciar ocultos y no destacados.`);
  const photoPath = resolve(extractionRoot, row.photo_file.replaceAll("/", sep));
  const rootPrefix = `${resolve(extractionRoot)}${sep}`;
  if (!photoPath.startsWith(rootPrefix) || !existsSync(photoPath)) throw new Error(`${row.external_id}: fotografía ausente o fuera del ZIP.`);
  if (!basename(photoPath, ".jpg").toLocaleLowerCase("es").endsWith(row.slug)) throw new Error(`${row.external_id}: la fotografía no coincide con el slug.`);
  const product = {
    ...row,
    tags: tags.map((tag) => tag.trim()),
    price: integer(row.price, "price", row),
    stock: integer(row.stock, "stock", row),
    production_hours: integer(row.production_hours, "production_hours", row),
    shipping_days: integer(row.shipping_days, "shipping_days", row),
    photoPath,
  };
  if (product.production_hours < 1 || product.production_hours > 720) throw new Error(`${row.external_id}: production_hours debe estar entre 1 y 720.`);
  if (product.shipping_days < 1 || product.shipping_days > 365) throw new Error(`${row.external_id}: shipping_days debe estar entre 1 y 365.`);
  const classificationErrors = catalogClassificationErrors(product);
  if (classificationErrors.length) throw new Error(classificationErrors.join(" "));
  return product;
}

async function photoHash(row) {
  const info = await stat(row.photoPath);
  if (info.size === 0 || info.size > MAX_IMAGE_BYTES) throw new Error(`${row.external_id}: la fotografía debe pesar entre 1 byte y 4 MB.`);
  const bytes = await readFile(row.photoPath);
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) throw new Error(`${row.external_id}: la fotografía no es un JPG válido.`);
  return { bytes, hash: createHash("sha256").update(bytes).digest("hex") };
}

function extractZip(zipPath, destination) {
  const result = spawnSync("powershell.exe", ["-NoProfile", "-File", join(import.meta.dirname, "extract-import.ps1"), zipPath, destination], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr.trim() || "No fue posible extraer el ZIP.");
}

async function queryWithRetry(pool, text, values = []) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await pool.query(text, values);
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolveDelay) => setTimeout(resolveDelay, 500 * (attempt + 1)));
    }
  }
  throw lastError;
}

async function uploadAndInsert(pool, row, token) {
  const pathname = `products/${row.slug}/catalog-${row.photoHash.slice(0, 16)}.jpg`;
  let blob;
  let uploaded = false;
  try {
    blob = await head(pathname, { token });
  } catch (error) {
    if (!(error instanceof BlobNotFoundError)) throw error;
    blob = await put(pathname, row.photoBytes, { access: "public", addRandomSuffix: false, contentType: "image/jpeg", token });
    uploaded = true;
  }

  try {
    const result = await pool.query(`INSERT INTO products
      (name, slug, description, category, product_type, tags, price, stock, production_hours, shipping_days, status, image_url, image_urls, makerworld_url, featured, active)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      ON CONFLICT (slug) DO NOTHING RETURNING id::text`,
    [row.name, row.slug, row.description, row.category, row.product_type, row.tags, row.price, row.stock, row.production_hours, row.shipping_days, row.status, blob.url, [blob.url], null, false, false]);
    return result.rowCount === 1 ? "created" : "skipped";
  } catch (error) {
    if (uploaded) await del(blob.url, { token }).catch(() => undefined);
    throw error;
  }
}

const zipPath = resolve(option("--zip") || "");
const execute = process.argv.includes("--execute");
const includeConflicts = process.argv.includes("--include-conflicts");
if (!option("--zip") || !existsSync(zipPath)) throw new Error("Usa --zip con la ruta del archivo de importación.");
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL es obligatorio incluso para comparar el dry-run.");
if (execute && !process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN es obligatorio para ejecutar la importación.");

const extractionRoot = await mkdtemp(join(tmpdir(), "3dcreativelab-import-"));
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  extractZip(zipPath, extractionRoot);
  const rows = parseCsv(await readFile(join(extractionRoot, "productos.csv"), "utf8")).map((row) => validateRow(row, extractionRoot));
  const externalIds = new Set();
  const slugs = new Set();
  const photoPaths = new Set();
  const hashes = new Map();
  for (const row of rows) {
    if (externalIds.has(row.external_id)) throw new Error(`ID externo duplicado: ${row.external_id}.`);
    if (slugs.has(row.slug)) throw new Error(`Slug duplicado: ${row.slug}.`);
    if (photoPaths.has(row.photo_file)) throw new Error(`Fotografía repetida: ${row.photo_file}.`);
    externalIds.add(row.external_id);
    slugs.add(row.slug);
    photoPaths.add(row.photo_file);
    const photo = await photoHash(row);
    row.photoHash = photo.hash;
    row.photoBytes = photo.bytes;
    const matchingImage = hashes.get(photo.hash);
    if (matchingImage) throw new Error(`Imagen idéntica en ${matchingImage} y ${row.external_id}.`);
    hashes.set(photo.hash, row.external_id);
  }

  const existingResult = await queryWithRetry(pool, "SELECT name, slug, category FROM products");
  const existingSlugs = new Set(existingResult.rows.map((row) => row.slug));
  const existingKeys = new Set(existingResult.rows.map((row) => normalizedProductKey(row.name, row.category)));
  const groups = Map.groupBy(rows, (row) => normalizedProductKey(row.name, row.category));
  const repeatedKeys = new Set([...groups].filter(([, group]) => group.length > 1).map(([key]) => key));
  const report = { create: [], skip: [], update: [], conflicts: [] };

  for (const row of rows) {
    const knownSlug = KNOWN_EXISTING.get(row.external_id);
    if (knownSlug && existingSlugs.has(knownSlug)) report.skip.push({ external_id: row.external_id, slug: row.slug, reason: `equivale al producto existente ${knownSlug}` });
    else if (existingSlugs.has(row.slug)) report.skip.push({ external_id: row.external_id, slug: row.slug, reason: "el slug ya existe" });
    else if (existingKeys.has(normalizedProductKey(row.name, row.category))) report.conflicts.push({ external_id: row.external_id, name: row.name, slug: row.slug, reason: "mismo nombre y categoría que un producto existente" });
    else if (repeatedKeys.has(normalizedProductKey(row.name, row.category))) report.conflicts.push({ external_id: row.external_id, name: row.name, slug: row.slug, reason: "nombre y categoría repetidos en el CSV; las imágenes son distintas" });
    else report.create.push(row);
  }

  const summary = {
    mode: execute ? "execute" : "dry-run",
    records: rows.length,
    existing_products: existingResult.rowCount,
    create: report.create.length,
    skip: report.skip.length,
    update: 0,
    conflicts: report.conflicts.length,
    conflict_groups: [...groups.values()].filter((group) => group.length > 1).map((group) => group.map(({ external_id, name, slug, category }) => ({ external_id, name, slug, category }))),
    skipped: report.skip,
    notes: ["No se sobrescribe ningún producto existente.", "MakerWorld queda vacío en productos nuevos.", "Todos los productos nuevos quedan ocultos.", "commercial_license_status no se guarda porque no existe en el esquema actual; las 423 filas están sin verificar."],
  };

  if (!execute) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    const candidates = includeConflicts ? [...report.create, ...report.conflicts.map((conflict) => rows.find((row) => row.external_id === conflict.external_id))] : report.create;
    let created = 0;
    let skipped = report.skip.length + (includeConflicts ? 0 : report.conflicts.length);
    for (const row of candidates) {
      const result = await uploadAndInsert(pool, row, process.env.BLOB_READ_WRITE_TOKEN);
      if (result === "created") created += 1;
      else skipped += 1;
    }
    console.log(JSON.stringify({ ...summary, created, skipped, included_conflicts: includeConflicts }, null, 2));
  }
} finally {
  await pool.end();
  await rm(extractionRoot, { recursive: true, force: true });
}
