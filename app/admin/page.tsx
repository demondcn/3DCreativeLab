import Link from "next/link";
import { formatCOP } from "@/lib/format";
import { requireAdminPage } from "@/lib/auth/server";
import { getProducts } from "@/lib/products";

export default async function AdminDashboard() {
  await requireAdminPage();
  const products = await getProducts({ includeInactive: true });
  const visible = products.filter((item) => item.active).length;
  const exhausted = products.filter((item) => item.stock === 0 || item.status === "agotado").length;
  const lowStock = products.filter((item) => item.stock > 0 && item.stock <= 2).length;
  const inventoryValue = products.reduce((sum, item) => sum + item.price * item.stock, 0);
  return <><header className="admin-heading"><div><span className="admin-context">Línea de control</span><h1>Resumen</h1></div><Link className="button-light" href="/admin/productos/nuevo">Nuevo producto</Link></header><section className="metric-grid five"><article><span>Total de productos</span><strong>{products.length}</strong></article><article><span>Productos visibles</span><strong>{visible}</strong></article><article><span>Agotados</span><strong>{exhausted}</strong></article><article><span>Inventario bajo</span><strong>{lowStock}</strong></article><article><span>Valor del inventario</span><strong>{formatCOP(inventoryValue)}</strong></article></section><section className="admin-panel"><h2>Requieren revisión</h2>{lowStock || exhausted ? <ul>{products.filter((item) => item.stock <= 2).map((item) => <li key={item.id}><Link href={`/admin/productos/${item.id}/editar`}>{item.name}</Link><span>{item.stock} unidades</span></li>)}</ul> : <p>No hay productos con inventario bajo.</p>}</section></>;
}

