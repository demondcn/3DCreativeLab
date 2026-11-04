"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth/server";
import { db } from "@/lib/neon";
import { productInputFromForm } from "@/lib/product-schema";
import { deleteProductImages, ImageUploadError, productImageFiles, uploadProductImages } from "@/lib/product-images";

export type ProductActionState = { error: string };

function isUniqueViolation(error: unknown) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "23505");
}

async function requireAdmin() {
  if (!(await getAdminSession())) redirect("/admin/login");
}

function refreshStore(slug?: string) {
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/admin");
  revalidatePath("/admin/productos");
  if (slug) revalidatePath(`/productos/${slug}`);
}

export async function createProduct(_previous: ProductActionState, formData: FormData): Promise<ProductActionState> {
  await requireAdmin();
  const parsed = productInputFromForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Revisa los datos." };
  const product = parsed.data;
  let uploaded: string[] = [];
  try {
    const sql = db();
    const duplicate = await sql<{ id: string }>`SELECT id::text FROM products WHERE slug=${product.slug} LIMIT 1`;
    if (duplicate[0]) return { error: `El slug “${product.slug}” ya está en uso. Edita el slug o cambia el nombre.` };
    uploaded = await uploadProductImages(product.slug, productImageFiles(formData));
    const imageUrls = uploaded.length ? uploaded : product.image_urls;
    await sql`INSERT INTO products (name, slug, description, category, product_type, tags, price, stock, production_hours, shipping_days, status, image_url, image_urls, makerworld_url, featured, active) VALUES (${product.name}, ${product.slug}, ${product.description}, ${product.category}, ${product.product_type}, ${product.tags}, ${product.price}, ${product.stock}, ${product.production_hours}, ${product.shipping_days}, ${product.status}, ${imageUrls[0] || ""}, ${imageUrls}, ${product.makerworld_url || null}, ${product.featured}, ${product.active})`;
  } catch (error) {
    await deleteProductImages(uploaded);
    if (error instanceof ImageUploadError) return { error: error.message };
    return { error: isUniqueViolation(error) ? `El slug “${product.slug}” ya está en uso. Edita el slug o cambia el nombre.` : "No fue posible guardar el producto. Revisa los datos e intenta nuevamente." };
  }
  refreshStore(product.slug);
  redirect("/admin/productos?success=created");
}

export async function updateProduct(_previous: ProductActionState, formData: FormData): Promise<ProductActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const parsed = productInputFromForm(formData);
  if (!id || !parsed.success) return { error: parsed.success ? "Producto inválido." : parsed.error.issues[0]?.message || "Revisa los datos." };
  const product = parsed.data;
  const sql = db();
  const current = await sql<{ image_urls: string[]; slug: string }>`SELECT image_urls, slug FROM products WHERE id=${id}::uuid LIMIT 1`;
  if (!current[0]) return { error: "El producto ya no existe." };
  const duplicate = await sql<{ id: string }>`SELECT id::text FROM products WHERE slug=${product.slug} AND id<>${id}::uuid LIMIT 1`;
  if (duplicate[0]) return { error: `El slug “${product.slug}” ya está en uso. Elige uno diferente.` };
  const oldImages = current[0].image_urls || [];
  let uploaded: string[] = [];
  try {
    const files = productImageFiles(formData);
    uploaded = await uploadProductImages(product.slug, files);
    const removeImages = formData.get("remove_images") === "on";
    const imageUrls = uploaded.length ? uploaded : removeImages ? [] : oldImages;
    await sql`UPDATE products SET name=${product.name}, slug=${product.slug}, description=${product.description}, category=${product.category}, product_type=${product.product_type}, tags=${product.tags}, price=${product.price}, stock=${product.stock}, production_hours=${product.production_hours}, shipping_days=${product.shipping_days}, status=${product.status}, image_url=${imageUrls[0] || ""}, image_urls=${imageUrls}, makerworld_url=${product.makerworld_url || null}, featured=${product.featured}, active=${product.active} WHERE id=${id}::uuid`;
    if (uploaded.length || removeImages) await deleteProductImages(oldImages);
  } catch (error) {
    await deleteProductImages(uploaded);
    if (error instanceof ImageUploadError) return { error: error.message };
    return { error: isUniqueViolation(error) ? `El slug “${product.slug}” ya está en uso. Elige uno diferente.` : "No fue posible actualizar el producto. Revisa los datos e intenta nuevamente." };
  }
  refreshStore(product.slug);
  refreshStore(current[0].slug);
  redirect("/admin/productos?success=updated");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const sql = db();
  const rows = await sql<{ image_urls: string[]; slug: string }>`SELECT image_urls, slug FROM products WHERE id=${id}::uuid LIMIT 1`;
  await sql`DELETE FROM products WHERE id=${id}::uuid`;
  if (rows[0]) {
    try { await deleteProductImages(rows[0].image_urls || []); } catch { /* A failed cleanup must not resurrect a deleted product. */ }
    refreshStore(rows[0].slug);
  }
  redirect("/admin/productos?success=deleted");
}

export async function updateStock(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const stock = Math.max(0, Math.floor(Number(formData.get("stock")) || 0));
  if (id) {
    const sql = db();
    await sql`UPDATE products SET stock=${stock}, status=CASE WHEN ${stock}=0 AND status='disponible' THEN 'agotado' ELSE status END WHERE id=${id}::uuid`;
  }
  refreshStore();
}
