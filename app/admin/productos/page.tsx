import Link from "next/link";
import { DeleteProductButton } from "@/components/delete-product-button";
import { updateStock } from "@/app/admin/actions";
import { formatCOP, productStatus } from "@/lib/format";
import { getProducts } from "@/lib/products";
import { requireAdminPage } from "@/lib/auth/server";

const notices: Record<string, string> = { created: "Producto creado correctamente.", updated: "Producto actualizado correctamente.", deleted: "Producto eliminado correctamente." };
export default async function AdminProducts({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  await requireAdminPage();
  const products = await getProducts({ includeInactive: true });
  const success = (await searchParams).success;
      return <><header className="admin-heading"><div><span className="admin-context">Inventario</span><h1>Productos</h1></div><Link className="button-light" href="/admin/productos/nuevo">Nuevo producto</Link></header>{success && notices[success] && <p className="success-notice" role="status">{notices[success]}</p>}{products.length === 0 ? <div className="empty-state"><h2>Catálogo vacío</h2><p>Crea el primer producto para publicarlo en la tienda.</p><Link className="button-dark" href="/admin/productos/nuevo">Crear producto</Link></div> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Producto</th><th>Precio</th><th>Estado</th><th>Inventario</th><th>Visible</th><th>Acciones</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><strong>{product.name}</strong><small>{product.category} · {product.product_type}{product.tags.length ? ` · ${product.tags.join(", ")}` : ""}</small></td><td>{formatCOP(product.price)}</td><td>{productStatus(product)}</td><td><form className="stock-form" action={updateStock}><input type="hidden" name="id" value={product.id} /><input name="stock" type="number" min="0" defaultValue={product.stock} aria-label={`Inventario de ${product.name}`} /><button>Actualizar</button></form></td><td>{product.active ? "Sí" : "No"}</td><td><div className="row-actions"><Link href={`/admin/productos/${product.id}/editar`}>Editar</Link><DeleteProductButton id={product.id} name={product.name} /></div></td></tr>)}</tbody></table></div>}</>;
}
