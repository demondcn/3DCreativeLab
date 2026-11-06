import Link from "next/link";
import { AdminProductTable } from "@/components/admin-product-table";
import { parseAdminProductFilters } from "@/lib/admin-product-filters";
import { getProducts } from "@/lib/products";
import { requireAdminPage } from "@/lib/auth/server";

const notices: Record<string, string> = { created: "Producto creado correctamente.", updated: "Producto actualizado correctamente.", deleted: "Producto eliminado correctamente." };

type ProductSearchParams = Record<string, string | string[] | undefined>;

export default async function AdminProducts({ searchParams }: { searchParams: Promise<ProductSearchParams> }) {
  await requireAdminPage();
  const products = await getProducts({ includeInactive: true });
  const params = await searchParams;
  const success = typeof params.success === "string" ? params.success : undefined;
  const filters = parseAdminProductFilters(params);

  return (
    <>
      <header className="admin-heading">
        <div>
          <span className="admin-context">Inventario</span>
          <h1>Productos</h1>
        </div>
        <Link className="button-light" href="/admin/productos/nuevo">Nuevo producto</Link>
      </header>
      {success && notices[success] && <p className="success-notice" role="status">{notices[success]}</p>}
      {products.length === 0 ? (
        <div className="empty-state">
          <h2>Catálogo vacío</h2>
          <p>Crea el primer producto para publicarlo en la tienda.</p>
          <Link className="button-dark" href="/admin/productos/nuevo">Crear producto</Link>
        </div>
      ) : <AdminProductTable products={products} initialFilters={filters} />}
    </>
  );
}
