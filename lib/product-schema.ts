import { z } from "zod";
import { normalizeProductTags } from "./product-tags";

export const productSchema = z.object({
  name: z.string().trim().min(3, "Escribe un nombre de al menos 3 caracteres.").max(100),
  slug: z.string().trim().min(3, "El slug debe tener al menos 3 caracteres.").max(120, "El slug no puede superar 120 caracteres.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "El slug solo puede usar letras minúsculas, números y guiones simples."),
  description: z.string().trim().min(10, "Describe el producto en al menos 10 caracteres.").max(1000),
  category: z.string().trim().min(2).max(60),
  product_type: z.string().trim().min(2, "Escribe el tipo de producto.").max(60),
  tags: z.array(z.string().trim().min(2, "Cada etiqueta debe tener al menos 2 caracteres.").max(40, "Cada etiqueta puede tener máximo 40 caracteres.")).max(12, "Puedes seleccionar máximo 12 etiquetas.").default([]),
  price: z.coerce.number().int().min(0, "El precio no puede ser negativo."),
  stock: z.coerce.number().int().min(0, "El inventario no puede ser negativo."),
  production_hours: z.coerce.number().int().min(1).max(720),
  shipping_days: z.coerce.number().int().min(1, "El envío debe tardar al menos un día.").max(365),
  status: z.enum(["disponible", "bajo_pedido", "agotado"]),
  image_urls: z.array(z.string().url()).max(6).default([]),
  makerworld_url: z.union([z.literal(""), z.string().url("El enlace de MakerWorld no es válido.").refine((value) => new URL(value).hostname.endsWith("makerworld.com"), "Usa un enlace de MakerWorld.")]).default(""),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;

export function productInputFromForm(formData: FormData) {
  let imageUrls: unknown = [];
  try { imageUrls = JSON.parse(String(formData.get("existing_image_urls") || "[]")); } catch { imageUrls = []; }
  return productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    category: formData.get("category"),
    product_type: formData.get("product_type"),
    tags: normalizeProductTags(formData.getAll("tags").map(String)),
    price: formData.get("price"),
    stock: formData.get("stock"),
    production_hours: formData.get("production_hours"),
    shipping_days: formData.get("shipping_days"),
    status: formData.get("status"),
    image_urls: imageUrls,
    makerworld_url: formData.get("makerworld_url"),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
  });
}

