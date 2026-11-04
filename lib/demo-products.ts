import type { Product } from "./types";

export const demoProducts: Product[] = [
  {
    id: "demo-maceta", name: "Maceta facetada", slug: "maceta-facetada", category: "Hogar", product_type: "Decoración", tags: ["Decoración", "Regalos"],
    description: "Maceta geométrica impresa en 3D, ligera y lista para una planta pequeña.",
    price: 25000, stock: 6, production_hours: 2, shipping_days: 3, status: "disponible", image_url: "/images/inspection-line.png", image_urls: ["/images/inspection-line.png"], makerworld_url: null, featured: true, active: true, demo: true,
  },
  {
    id: "demo-soporte", name: "Soporte para audífonos", slug: "soporte-audifonos", category: "Escritorio", product_type: "Accesorio", tags: ["Geek", "Regalos"],
    description: "Soporte estable para mantener los audífonos ordenados y al alcance.",
    price: 35000, stock: 4, production_hours: 3, shipping_days: 3, status: "disponible", image_url: "/images/inspection-line.png", image_urls: ["/images/inspection-line.png"], makerworld_url: null, featured: true, active: true, demo: true,
  },
  {
    id: "demo-dino", name: "Dinosaurio articulado", slug: "dinosaurio-articulado", category: "Figuras", product_type: "Juguete", tags: ["Articulados", "Coleccionables"],
    description: "Figura articulada fabricada por capas, disponible en distintos tamaños.",
    price: 40000, stock: 0, production_hours: 6, shipping_days: 5, status: "bajo_pedido", image_url: "/images/inspection-line.png", image_urls: ["/images/inspection-line.png"], makerworld_url: null, featured: true, active: true, demo: true,
  },
  {
    id: "demo-engranaje", name: "Engranaje funcional", slug: "engranaje-funcional", category: "Repuestos", product_type: "Pieza funcional", tags: ["Personalizados"],
    description: "Pieza funcional de demostración para prototipos y mecanismos de baja carga.",
    price: 18000, stock: 2, production_hours: 2, shipping_days: 3, status: "disponible", image_url: "/images/printer-detail.png", image_urls: ["/images/printer-detail.png"], makerworld_url: null, featured: false, active: true, demo: true,
  },
];

