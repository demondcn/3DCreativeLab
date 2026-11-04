CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 3 AND 100),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text NOT NULL CHECK (char_length(description) BETWEEN 10 AND 1000),
  category text NOT NULL CHECK (char_length(category) BETWEEN 2 AND 60),
  price integer NOT NULL CHECK (price >= 0),
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  production_hours integer NOT NULL DEFAULT 1 CHECK (production_hours BETWEEN 1 AND 720),
  status text NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'bajo_pedido', 'agotado')),
  image_url text NOT NULL DEFAULT '',
  featured boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_active_created_idx ON products (active, created_at DESC);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products (featured) WHERE active = true;
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category) WHERE active = true;

COMMENT ON TABLE products IS 'Catálogo e inventario de 3DCreativeLab. Todas las escrituras se ejecutan en el servidor tras validar Neon Auth y ADMIN_EMAIL.';

