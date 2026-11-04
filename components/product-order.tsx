"use client";

import { useState } from "react";
import { productWhatsAppUrl } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductOrder({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const unavailable = product.status === "agotado" || (product.status === "disponible" && product.stock === 0);
  return (
    <div className="order-box">
      <label>Cantidad<input type="number" min="1" max="99" value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(99, Number(event.target.value) || 1)))} /></label>
      {unavailable ? <p className="stock-warning">Producto agotado. Escríbenos para consultar la próxima fabricación.</p> : <p>{product.status === "bajo_pedido" ? "Se fabrica después de confirmar el pedido." : `${product.stock} unidades registradas en inventario.`}</p>}
      <a className="button-dark" href={productWhatsAppUrl(product, quantity)} target="_blank" rel="noreferrer">{unavailable ? "Consultar por WhatsApp" : "Pedir por WhatsApp"}</a>
    </div>
  );
}

