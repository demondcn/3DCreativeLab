import type { Product } from "./types";

export const WHATSAPP_NUMBER = "573024468132";

export function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function productStatus(product: Pick<Product, "status" | "stock">) {
  if (product.status === "agotado" || (product.status === "disponible" && product.stock === 0)) return "Agotado";
  return product.status === "bajo_pedido" ? "Bajo pedido" : "Disponible";
}

export function buildWhatsAppUrl(message?: string) {
  const text = message?.trim() || "Hola 3DCreativeLab, quiero información sobre sus impresiones 3D.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function productWhatsAppUrl(product: Product, quantity = 1) {
  return buildWhatsAppUrl(
    `Hola 3DCreativeLab, quiero solicitar ${quantity} × ${product.name}. Precio unitario: ${formatCOP(product.price)}. Total estimado: ${formatCOP(product.price * quantity)}. Referencia: ${product.slug}. Por favor confirma disponibilidad, total final y entrega.`,
  );
}

export function primaryProductImage(product: Pick<Product, "image_urls" | "image_url">) {
  return product.image_urls?.[0] || product.image_url || "";
}

