import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { formatCOP, productStatus } from "@/lib/format";
import { getProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

function ProductStation({ product }: { product: Product }) {
  return (
    <article className="station-card" tabIndex={0} aria-label={`${product.name}${product.demo ? ", demostración" : ""}, ${formatCOP(product.price)}, ${productStatus(product)}`}>
      <h2>{product.name}{product.demo ? " · demostración" : ""}</h2>
      <dl>
        <div><dt>Precio</dt><dd>{formatCOP(product.price)}</dd></div>
        <div><dt>Estado</dt><dd><span>{productStatus(product)}</span></dd></div>
      </dl>
    </article>
  );
}

export default async function HomePage() {
  const featured = await getProducts({ featured: true });
  const stations = featured.slice(0, 3);
  const products = featured.slice(0, 4);
  return (
    <main>
      <section className="first-viewport" aria-labelledby="hero-title">
        <SiteHeader />
        <div className="hero-stage">
          <Image className="inspection-image" src="/images/inspection-line.png" alt="Tres objetos impresos en 3D en estaciones de inspección." fill priority sizes="(max-width: 900px) 100vw, 73vw" />
          <div className="hero-copy">
            <h1 id="hero-title"><span>Del archivo</span><span>al objeto</span></h1>
            <p>Imprimimos piezas con acabado profesional, disponibles o hechas bajo pedido.</p>
            <Link className="hero-action" href="/productos">Explorar catálogo <span aria-hidden="true">→</span></Link>
          </div>
          <div className="station-data" aria-label="Productos destacados">{stations.map((product) => <ProductStation key={product.id} product={product} />)}</div>
        </div>
        <div className="custom-strip">
          <div><h2><span>Tu pieza</span><span>personalizada</span></h2></div>
          <p>Cuéntanos tu idea, te asesoramos y la fabricamos en 3D.</p>
          <Image src="/images/printer-detail.png" alt="Boquilla de una impresora 3D fabricando una pieza." width={640} height={400} />
        </div>
      </section>
      <section className="content-section" aria-labelledby="featured-title">
        <div className="section-heading"><h2 id="featured-title">Piezas en inspección</h2><Link href="/productos">Ver catálogo completo →</Link></div>
        <div className="catalog-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>
      <section className="process-section" id="fabricacion" aria-labelledby="process-title">
        <div className="section-heading inverse"><h2 id="process-title">De idea a pieza</h2></div>
        <ol className="process-grid">
          <li><h3>Revisamos</h3><p>Validamos medidas, uso y archivo 3D antes de cotizar.</p></li>
          <li><h3>Preparamos</h3><p>Definimos material, orientación y parámetros de fabricación.</p></li>
          <li><h3>Imprimimos</h3><p>Fabricamos por capas y controlamos el avance de la pieza.</p></li>
          <li><h3>Inspeccionamos</h3><p>Verificamos acabado y dimensiones antes de entregar.</p></li>
        </ol>
      </section>
      <section className="custom-cta"><h2>Pieza por existir.</h2><p>Fabricación personalizada: envíanos la idea, las medidas y el uso esperado. Te orientamos por WhatsApp.</p><Link className="button-light" href="/personalizados">Solicitar cotización →</Link></section>
      <SiteFooter /><WhatsAppFloat />
    </main>
  );
}

