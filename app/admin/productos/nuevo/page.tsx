import { AdminProductForm } from "@/components/admin-product-form";
import { createProduct } from "@/app/admin/actions";
import { requireAdminPage } from "@/lib/auth/server";
export default async function NewProductPage() { await requireAdminPage(); return <><header className="admin-heading"><div><span className="admin-context">Catálogo</span><h1>Nuevo producto</h1></div></header><AdminProductForm action={createProduct} /></>; }

