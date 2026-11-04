"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import type { ProductActionState } from "@/app/admin/actions";
import { productSlug } from "@/lib/product-slug";
import { normalizeProductTags, SUGGESTED_PRODUCT_TAGS } from "@/lib/product-tags";
import type { Product } from "@/lib/types";

type Action = (previous: ProductActionState, data: FormData) => Promise<ProductActionState>;

export function AdminProductForm({ action, product }: { action: Action; product?: Product }) {
  const [state, formAction, pending] = useActionState(action, { error: "" });
  const [previews, setPreviews] = useState<string[]>([]);
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [slugEdited, setSlugEdited] = useState(Boolean(product));
  const [selectedTags, setSelectedTags] = useState(product?.tags || []);
  const [availableTags, setAvailableTags] = useState(() => normalizeProductTags([...SUGGESTED_PRODUCT_TAGS, ...(product?.tags || [])]));
  const [tagDraft, setTagDraft] = useState("");
  const [tagError, setTagError] = useState("");

  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  function previewFiles(files: FileList | null) {
    previews.forEach(URL.revokeObjectURL);
    setPreviews(files ? Array.from(files).slice(0, 6).map(URL.createObjectURL) : []);
  }

  function changeName(value: string) {
    setName(value);
    if (!slugEdited) setSlug(productSlug(value));
  }

  function addTag() {
    const tag = tagDraft.trim().replace(/\s+/g, " ");
    if (tag.length < 2 || tag.length > 40) return setTagError("La etiqueta debe tener entre 2 y 40 caracteres.");
    if (selectedTags.length >= 12) return setTagError("Puedes seleccionar máximo 12 etiquetas.");
    const existing = availableTags.find((item) => item.toLocaleLowerCase("es") === tag.toLocaleLowerCase("es"));
    const next = existing || tag;
    if (!existing) setAvailableTags((current) => [...current, tag]);
    setSelectedTags((current) => current.some((item) => item.toLocaleLowerCase("es") === next.toLocaleLowerCase("es")) ? current : [...current, next]);
    setTagDraft("");
    setTagError("");
  }

  const existingImages = product?.image_urls?.length ? product.image_urls : product?.image_url ? [product.image_url] : [];

  return (
    <form className="admin-form product-form" action={formAction} encType="multipart/form-data">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="existing_image_urls" value={JSON.stringify(existingImages)} />
      <div className="form-row">
        <label>Nombre<input name="name" required minLength={3} maxLength={100} value={name} onChange={(event) => changeName(event.target.value)} /></label>
        <label>Slug<input name="slug" required minLength={3} maxLength={120} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" title="Usa letras minúsculas, números y guiones simples." value={slug} onChange={(event) => { setSlug(event.target.value); setSlugEdited(true); }} onBlur={() => setSlug(productSlug(slug))} aria-describedby="slug-help" /><span className="field-help" id="slug-help">Se genera desde el nombre. Puedes editarlo antes de guardar; debe ser único.</span></label>
      </div>
      <label>Descripción<textarea name="description" rows={5} required minLength={10} defaultValue={product?.description} /></label>
      <div className="form-row">
        <label>Categoría<input name="category" required defaultValue={product?.category} /></label>
        <label>Tipo<input name="product_type" required defaultValue={product?.product_type || "Producto"} /></label>
      </div>
      <fieldset className="tag-fieldset"><legend>Etiquetas</legend><div className="tag-selector">{availableTags.map((tag) => <label className="tag-option" key={tag}><input name="tags" type="checkbox" value={tag} checked={selectedTags.includes(tag)} onChange={(event) => setSelectedTags((current) => event.target.checked ? [...current, tag] : current.filter((item) => item !== tag))} /> {tag}</label>)}</div><div className="tag-add"><label>Nueva etiqueta<input value={tagDraft} onChange={(event) => setTagDraft(event.target.value)} minLength={2} maxLength={40} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTag(); } }} /></label><button className="button-light" type="button" onClick={addTag}>Agregar etiqueta</button></div>{tagError && <p className="form-error" role="alert">{tagError}</p>}<p className="field-help">Selecciona varias o agrega una nueva. Máximo 12.</p></fieldset>
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
