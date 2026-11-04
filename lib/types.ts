export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  product_type: string;
  tags: string[];
  price: number;
  stock: number;
  production_hours: number;
  shipping_days: number;
  status: "disponible" | "bajo_pedido" | "agotado";
  image_url: string;
  image_urls: string[];
  makerworld_url: string | null;
  featured: boolean;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  demo?: boolean;
};

