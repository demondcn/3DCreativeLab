"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

export function CatalogBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [productType, setProductType] = useState("Todos");
  const [order, setOrder] = useState("recent");
  const categories = ["Todas", ...Array.from(new Set(products.map((item) => item.category)))];
  const productTypes = ["Todos", ...Array.from(new Set(products.map((item) => item.product_type)))];
  const visible = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    return products
      .filter((item) => category === "Todas" || item.category === category)
      .filter((item) => productType === "Todos" || item.product_type === productType)
      .filter((item) => !normalized || `${item.name} ${item.description}`.toLocaleLowerCase("es").includes(normalized))
      .toSorted((a, b) => order === "price-asc" ? a.price - b.price : order === "price-desc" ? b.price - a.price : order === "name" ? a.name.localeCompare(b.name, "es") : 0);
  }, [products, query, category, productType, order]);

  return (
    <>
      <div className="catalog-tools">
        <label>Buscar<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre o descripción" /></label>
        <label>Categoría<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Tipo<select value={productType} onChange={(event) => setProductType(event.target.value)}>{productTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Orden<select value={order} onChange={(event) => setOrder(event.target.value)}><option value="recent">Más recientes</option><option value="name">Nombre</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option></select></label>
      </div>
      <p className="result-count" aria-live="polite">{visible.length} {visible.length === 1 ? "producto" : "productos"}</p>
      {visible.length ? <div className="catalog-grid">{visible.map((product, index) => <ProductCard key={product.id} product={product} priority={index < 3} />)}</div> : <div className="empty-state"><h2>No encontramos coincidencias</h2><p>Prueba otra categoría o un término más corto.</p></div>}
    </>
  );
}
