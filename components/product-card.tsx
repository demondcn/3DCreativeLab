import Image from "next/image";
import Link from "next/link";
import { formatCOP, primaryProductImage, productStatus } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = primaryProductImage(product);
  return (
    <article className="catalog-card">
      <Link href={`/productos/${product.slug}`} className="product-image-link" aria-label={`Ver ${product.name}`}>
        {image ? <Image src={image} alt={product.name} width={800} height={620} priority={priority} unoptimized={image.startsWith("http")} /> : <span className="image-placeholder">Sin fotografía</span>}
      </Link>
      <div className="catalog-card-body">
        <h2><Link href={`/productos/${product.slug}`}>{product.name}</Link></h2>
        <div className="product-tags"><span>{product.category} · {product.product_type}</span>{product.demo && <span className="demo-label">Demostración</span>}</div>
        {product.tags.length > 0 && <ul className="tag-list" aria-label="Etiquetas">{product.tags.slice(0, 3).map((tag) => <li key={tag}>{tag}</li>)}</ul>}
        <div className="product-meta"><strong>{formatCOP(product.price)}</strong><span>{productStatus(product)}</span></div>
      </div>
    </article>
  );
}

