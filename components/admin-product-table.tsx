"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { updateStock } from "@/app/admin/actions";
import { DeleteProductButton } from "@/components/delete-product-button";
import {
  defaultAdminProductFilters,
  filterAdminProducts,
  validMakerWorldUrl,
  type AdminProductFilters,
} from "@/lib/admin-product-filters";
import { formatCOP, productStatus } from "@/lib/format";
import type { Product } from "@/lib/types";

type FilterKey = keyof AdminProductFilters;

const filterKeys: FilterKey[] = ["price", "status", "stock", "visible", "makerworld", "sort"];

export function AdminProductTable({ products, initialFilters }: { products: Product[]; initialFilters: AdminProductFilters }) {
  const [filters, setFilters] = useState(initialFilters);
  const results = useMemo(() => filterAdminProducts(products, filters), [products, filters]);

  function replaceFilterParams(next: AdminProductFilters) {
    const url = new URL(window.location.href);
    for (const key of filterKeys) {
      if (next[key] === defaultAdminProductFilters[key]) url.searchParams.delete(key);
      else url.searchParams.set(key, next[key]);
    }
    window.history.replaceState(null, "", url);
  }

  function updateFilter<Key extends FilterKey>(key: Key, value: AdminProductFilters[Key]) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    replaceFilterParams(next);
  }

  function clearFilters() {
    setFilters(defaultAdminProductFilters);
    replaceFilterParams(defaultAdminProductFilters);
  }

  return (
    <section aria-labelledby="product-results">
      <div className="admin-filter-summary">
        <p id="product-results" aria-live="polite">
          <strong>{results.length}</strong> {results.length === 1 ? "producto encontrado" : "productos encontrados"}
        </p>
        <button className="clear-filters" type="button" onClick={clearFilters}>Limpiar filtros</button>
      </div>

      <div className="admin-table-wrap" tabIndex={0} aria-label="Tabla de productos; desplázate horizontalmente si es necesario">
        <table className="admin-table admin-products-table">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">Precio</th>
              <th scope="col">Estado</th>
              <th scope="col">Inventario</th>
              <th scope="col">Visible</th>
              <th scope="col">MakerWorld</th>
              <th scope="col">Acciones</th>
            </tr>
            <tr className="admin-filter-row">
              <th aria-label="Producto sin filtro" />
              <th>
                <label>
                  <span>Rango de precio</span>
                  <select value={filters.price} onChange={(event) => updateFilter("price", event.target.value as AdminProductFilters["price"])}>
                    <option value="all">Todos los precios</option>
                    <option value="up-to-10000">Hasta $10.000</option>
                    <option value="10001-20000">$10.001–$20.000</option>
                    <option value="20001-35000">$20.001–$35.000</option>
                    <option value="above-35000">Más de $35.000</option>
                  </select>
                </label>
                <label>
                  <span>Orden de precio</span>
                  <select value={filters.sort.startsWith("price") ? filters.sort : "none"} onChange={(event) => updateFilter("sort", event.target.value as AdminProductFilters["sort"])}>
                    <option value="none">Sin ordenar</option>
                    <option value="price-asc">Menor a mayor</option>
                    <option value="price-desc">Mayor a menor</option>
                  </select>
                </label>
              </th>
              <th>
                <label>
                  <span>Filtrar estado</span>
                  <select value={filters.status} onChange={(event) => updateFilter("status", event.target.value as AdminProductFilters["status"])}>
                    <option value="all">Todos</option>
                    <option value="disponible">Disponible</option>
                    <option value="bajo_pedido">Bajo pedido</option>
                    <option value="agotado">Agotado</option>
                  </select>
                </label>
              </th>
              <th>
                <label>
                  <span>Filtrar inventario</span>
                  <select value={filters.stock} onChange={(event) => updateFilter("stock", event.target.value as AdminProductFilters["stock"])}>
                    <option value="all">Todos</option>
                    <option value="zero">Sin stock</option>
                    <option value="one">1 unidad</option>
                    <option value="two-plus">2 o más unidades</option>
                  </select>
                </label>
                <label>
                  <span>Orden de inventario</span>
                  <select value={filters.sort.startsWith("stock") ? filters.sort : "none"} onChange={(event) => updateFilter("sort", event.target.value as AdminProductFilters["sort"])}>
                    <option value="none">Sin ordenar</option>
                    <option value="stock-asc">Menor a mayor</option>
                    <option value="stock-desc">Mayor a menor</option>
                  </select>
                </label>
              </th>
              <th>
                <label>
                  <span>Filtrar visibilidad</span>
                  <select value={filters.visible} onChange={(event) => updateFilter("visible", event.target.value as AdminProductFilters["visible"])}>
                    <option value="all">Todos</option>
                    <option value="yes">Sí</option>
                    <option value="no">No</option>
                  </select>
                </label>
              </th>
              <th>
                <label>
                  <span>Filtrar MakerWorld</span>
                  <select value={filters.makerworld} onChange={(event) => updateFilter("makerworld", event.target.value as AdminProductFilters["makerworld"])}>
                    <option value="all">Todos</option>
                    <option value="with">Con enlace</option>
                    <option value="without">Sin enlace</option>
                  </select>
                </label>
              </th>
              <th aria-label="Acciones sin filtro" />
            </tr>
          </thead>
          <tbody>
            {results.map((product) => {
              const makerWorldUrl = validMakerWorldUrl(product.makerworld_url);
              return (
                <tr key={product.id}>
                  <td>
                    <strong>{product.name}</strong>
                    <small>{product.category} · {product.product_type}{product.tags.length ? ` · ${product.tags.join(", ")}` : ""}</small>
                  </td>
                  <td className="numeric-cell">{formatCOP(product.price)}</td>
                  <td>{productStatus(product)}</td>
                  <td>
                    <form className="stock-form" action={updateStock}>
                      <input type="hidden" name="id" value={product.id} />
                      <input name="stock" type="number" min="0" defaultValue={product.stock} aria-label={`Inventario de ${product.name}`} />
                      <button>Actualizar</button>
                    </form>
                  </td>
                  <td>{product.active ? "Sí" : "No"}</td>
                  <td>
                    {makerWorldUrl ? (
                      <a href={makerWorldUrl} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${product.name} en MakerWorld (nueva pestaña)`}>Sí</a>
                    ) : "No"}
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link href={`/admin/productos/${product.id}/editar`}>Editar</Link>
                      <DeleteProductButton id={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {results.length === 0 && (
              <tr>
                <td className="admin-filter-empty" colSpan={7}>No hay productos que coincidan con esta combinación de filtros.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
