import { notFound } from "next/navigation";
import { AdminProductForm } from "@/components/admin-product-form";
import { updateProduct } from "@/app/admin/actions";
import { getProductById } from "@/lib/products";
import { requireAdminPage } from "@/lib/auth/server";
export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) { await requireAdminPage(); const { id } = await params; const product = await getProductById(id); if (!product) notFound(); return <><header className="admin-heading"><div><span className="admin-context">Catálogo</span><h1>Editar producto</h1></div></header><AdminProductForm action={updateProduct} product={product} /></>; }
