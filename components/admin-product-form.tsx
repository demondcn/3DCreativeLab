"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import type { ProductActionState } from "@/app/admin/actions";
import type { Product } from "@/lib/types";

type Action = (previous: ProductActionState, data: FormData) => Promise<ProductActionState>;

export function AdminProductForm({ action, product }: { action: Action; product?: Product }) {
  const [state, formAction, pending] = useActionState(action, { error: "" });
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  function previewFiles(files: FileList | null) {
    previews.forEach(URL.revokeObjectURL);
    setPreviews(files ? Array.from(files).slice(0, 6).map(URL.createObjectURL) : []);
  }

  const existingImages = product?.image_urls?.length ? product.image_urls : product?.image_url ? [product.image_url] : [];

  return (
    <form className="admin-form product-form" action={formAction} encType="multipart/form-data">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="existing_image_urls" value={JSON.stringify(existingImages)} />
      <div className="form-row">
        <label>Nombre<input name="name" required minLength={3} maxLength={100} defaultValue={product?.name} /></label>
        <label>Slug<input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={product?.slug} /></label>
      </div>
      <label>Descripción<textarea name="description" rows={5} required minLength={10} defaultValue={product?.description} /></label>
      <div className="form-row">
        <label>Categoría<input name="category" required defaultValue={product?.category} /></label>
        <label>Tipo<input name="product_type" required defaultValue={product?.product_type || "Producto"} /></label>
      </div>
      <div className="form-row three">
        <label>Precio COP<input name="price" type="number" min="0" step="1" required defaultValue={product?.price ?? 0} /></label>
        <label>Inventario<input name="stock" type="number" min="0" step="1" required defaultValue={product?.stock ?? 0} /></label>
        <label>Estado<select name="status" defaultValue={product?.status || "disponible"}><option value="disponible">Disponible</option><option value="bajo_pedido">Bajo pedido</option><option value="agotado">Agotado</option></select></label>
      </div>
      <div className="form-row">
        <label>Horas de impresión<input name="production_hours" type="number" min="1" max="720" required defaultValue={product?.production_hours ?? 1} /></label>
        <label>Días estimados de envío<input name="shipping_days" type="number" min="1" max="365" required defaultValue={product?.shipping_days ?? 1} /></label>
      </div>
      <label>Enlace de MakerWorld<input name="makerworld_url" type="url" inputMode="url" defaultValue={product?.makerworld_url || ""} placeholder="https://makerworld.com/…" /></label>
      <label>Fotografías
        <input name="images" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={(event) => previewFiles(event.target.files)} />
        <span className="field-help">Hasta 6 archivos JPG, PNG, WebP o AVIF. Máximo 4 MB cada uno. Una nueva selección reemplaza las fotos actuales.</span>
      </label>
      {(previews.length > 0 || existingImages.length > 0) && (
        <div className="image-preview-grid" aria-label="Vista previa de fotografías">
          {(previews.length ? previews : existingImages).map((src) => <Image key={src} src={src} alt="Vista previa del producto" width={180} height={140} unoptimized={src.startsWith("http")} />)}
        </div>
      )}
      {existingImages.length > 0 && <label className="remove-images"><input name="remove_images" type="checkbox" /> Eliminar fotografías actuales sin reemplazarlas</label>}
      <div className="check-row">
        <label><input name="featured" type="checkbox" defaultChecked={product?.featured} /> Destacado</label>
        <label><input name="active" type="checkbox" defaultChecked={product?.active ?? true} /> Visible en catálogo</label>
      </div>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="button-light" disabled={pending}>{pending ? "Guardando…" : "Guardar producto"}</button>
    </form>
  );
}
