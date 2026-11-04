import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = { title: "Catálogo", description: "Catálogo de productos impresos en 3D de 3DCreativeLab." };
export const dynamic = "force-dynamic";
export default async function ProductsPage() {
  const products = await getProducts();
  return <><SiteHeader /><main className="page-shell"><header className="page-intro"><h1>Catálogo 3D</h1><p>Productos en la línea de inspección: piezas disponibles y fabricadas bajo pedido. Confirma color, existencias y entrega antes de ordenar.</p></header><CatalogBrowser products={products} /></main><SiteFooter /><WhatsAppFloat /></>;
}

