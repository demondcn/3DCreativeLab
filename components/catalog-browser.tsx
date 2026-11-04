"use client";

import { useMemo, useState } from "react";
import { filterProducts } from "@/lib/catalog-filters";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

export function CatalogBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [productType, setProductType] = useState("Todos");
  const [tag, setTag] = useState("Todas");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [order, setOrder] = useState("recent");
  const categories = ["Todas", ...Array.from(new Set(products.map((item) => item.category)))];
  const productTypes = ["Todos", ...Array.from(new Set(products.map((item) => item.product_type)))];
  const tags = ["Todas", ...Array.from(new Set(products.flatMap((item) => item.tags))).toSorted((a, b) => a.localeCompare(b, "es"))];
  const visible = useMemo(() => {
    return filterProducts(products, { query, category, productType, tag, minPrice: minPrice === "" ? undefined : Number(minPrice), maxPrice: maxPrice === "" ? undefined : Number(maxPrice), order });
  }, [products, query, category, productType, tag, minPrice, maxPrice, order]);

  return (
    <>
      <div className="catalog-tools">
        <label>Buscar<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre o descripción" /></label>
        <label>Categoría<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Tipo<select value={productType} onChange={(event) => setProductType(event.target.value)}>{productTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Etiqueta<select value={tag} onChange={(event) => setTag(event.target.value)}>{tags.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Precio mínimo<input type="number" min="0" step="1000" inputMode="numeric" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="0" /></label>
        <label>Precio máximo<input type="number" min="0" step="1000" inputMode="numeric" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Sin límite" /></label>
        <label>Orden<select value={order} onChange={(event) => setOrder(event.target.value)}><option value="recent">Más recientes</option><option value="name">Nombre</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option></select></label>
      </div>
      <p className="result-count" aria-live="polite">{visible.length} {visible.length === 1 ? "producto" : "productos"}</p>
      {visible.length ? <div className="catalog-grid">{visible.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 3} />)}</div> : <div className="empty-state"><h2>No encontramos coincidencias</h2><p>Ajusta la categoría, el tipo, las etiquetas o el rango de precio.</p></div>}
    </>
  );
}
