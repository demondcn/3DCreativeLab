INSERT INTO products (name, slug, description, category, price, stock, production_hours, status, image_url, featured, active)
VALUES
  ('Maceta facetada', 'maceta-facetada', 'Maceta geométrica impresa en 3D, ligera y lista para una planta pequeña.', 'Hogar', 25000, 6, 2, 'disponible', '/images/inspection-line.png', true, true),
  ('Soporte para audífonos', 'soporte-audifonos', 'Soporte estable para mantener los audífonos ordenados y al alcance.', 'Escritorio', 35000, 4, 3, 'disponible', '/images/inspection-line.png', true, true),
  ('Dinosaurio articulado', 'dinosaurio-articulado', 'Figura articulada fabricada por capas, disponible en distintos tamaños.', 'Figuras', 40000, 0, 6, 'bajo_pedido', '/images/inspection-line.png', true, true),
  ('Engranaje funcional', 'engranaje-funcional', 'Pieza funcional de demostración para prototipos y mecanismos de baja carga.', 'Repuestos', 18000, 2, 2, 'disponible', '/images/printer-detail.png', false, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  production_hours = EXCLUDED.production_hours,
  status = EXCLUDED.status,
  image_url = EXCLUDED.image_url,
  featured = EXCLUDED.featured,
  active = EXCLUDED.active,
  updated_at = now();
