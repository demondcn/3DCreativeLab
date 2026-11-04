import type { Metadata } from "next";
import { CustomRequestForm } from "@/components/custom-request-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
export const metadata: Metadata = { title: "Piezas personalizadas", description: "Solicita una cotización de impresión 3D personalizada." };
export default function CustomPage() { return <><SiteHeader /><main className="custom-page"><section><h1>Tu idea entra a la línea.</h1><p>Solicitud personalizada: describe la pieza y sus medidas. Revisaremos si es fabricable y confirmaremos material, precio y plazo antes de imprimir.</p><ol><li>Envía la información</li><li>Revisamos el diseño</li><li>Confirmamos la cotización</li></ol></section><CustomRequestForm /></main><SiteFooter /></>; }
