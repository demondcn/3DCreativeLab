import { del, put } from "@vercel/blob";

export const MAX_PRODUCT_IMAGES = 6;
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export class ImageUploadError extends Error {}

export function productImageFiles(formData: FormData) {
  const files = formData.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
  if (files.length > MAX_PRODUCT_IMAGES) throw new ImageUploadError(`Puedes subir máximo ${MAX_PRODUCT_IMAGES} imágenes.`);
  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) throw new ImageUploadError("Usa imágenes JPG, PNG, WebP o AVIF.");
    if (file.size > MAX_IMAGE_BYTES) throw new ImageUploadError("Cada imagen debe pesar máximo 4 MB.");
  }
  return files;
}

export async function uploadProductImages(slug: string, files: File[]) {
  if (!files.length) return [];
  if (!process.env.BLOB_READ_WRITE_TOKEN) throw new ImageUploadError("Configura BLOB_READ_WRITE_TOKEN para subir imágenes.");
  const uploaded: string[] = [];
  try {
    for (const file of files) {
      const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "img";
      const blob = await put(`products/${slug}/${crypto.randomUUID()}.${extension}`, file, {
        access: "public",
        addRandomSuffix: false,
        contentType: file.type,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      uploaded.push(blob.url);
    }
    return uploaded;
  } catch (error) {
    await deleteProductImages(uploaded);
    if (error instanceof ImageUploadError) throw error;
    throw new ImageUploadError("No fue posible subir las imágenes.");
  }
}

export async function deleteProductImages(urls: string[]) {
  const owned = urls.filter((url) => url.includes(".blob.vercel-storage.com/"));
  if (!owned.length || !process.env.BLOB_READ_WRITE_TOKEN) return;
  await del(owned, { token: process.env.BLOB_READ_WRITE_TOKEN });
}

