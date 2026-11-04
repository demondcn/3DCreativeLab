import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductOrder } from "@/components/product-order";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatCOP, primaryProductImage, productStatus } from "@/lib/format";
import { getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  const primaryImage = primaryProductImage(product);
  const images = product.image_urls?.length ? product.image_urls : primaryImage ? [primaryImage] : [];

  return (
    <>
      <SiteHeader />
      <main className="product-detail">
        <div className="detail-gallery">
          {images.length ? images.map((image, index) => <Image key={image} src={image} alt={`${product.name}${index ? `, fotografía ${index + 1}` : ""}`} width={1200} height={1000} priority={index === 0} unoptimized={image.startsWith("http")} />) : <div className="detail-placeholder">Sin fotografía disponible</div>}
        </div>
        <div className="detail-copy">
          <Link href="/productos" className="back-link">← Volver al catálogo</Link>
          <h1>{product.name}</h1>
          <p className="product-context">{product.category} · {product.product_type} · {productStatus(product)}</p>
          <p className="detail-price">{formatCOP(product.price)}</p>
          <p>{product.description}</p>
          <dl className="inspection-list">
            <div><dt>Impresión estimada</dt><dd>~ {product.production_hours} horas</dd></div>
            <div><dt>Envío estimado</dt><dd>~ {product.shipping_days} días</dd></div>
            <div><dt>Inventario</dt><dd>{product.stock}</dd></div>
            <div><dt>Referencia</dt><dd>{product.slug}</dd></div>
          </dl>
          {product.makerworld_url && <a className="makerworld-link" href={product.makerworld_url} target="_blank" rel="noopener noreferrer">Ver modelo en MakerWorld ↗</a>}
          <ProductOrder product={product} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
