ALTER TABLE products
  ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'Producto' CHECK (char_length(product_type) BETWEEN 2 AND 60),
  ADD COLUMN IF NOT EXISTS shipping_days integer NOT NULL DEFAULT 1 CHECK (shipping_days BETWEEN 1 AND 365),
  ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS makerworld_url text;

UPDATE products
SET image_urls = ARRAY[image_url]
WHERE image_url <> '' AND cardinality(image_urls) = 0;

ALTER TABLE products DROP CONSTRAINT IF EXISTS products_makerworld_url_check;
ALTER TABLE products
  ADD CONSTRAINT products_makerworld_url_check
  CHECK (makerworld_url IS NULL OR makerworld_url = '' OR makerworld_url ~ '^https://');

CREATE OR REPLACE FUNCTION set_products_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_updated_at_trigger ON products;
CREATE TRIGGER products_updated_at_trigger
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION set_products_updated_at();

CREATE INDEX IF NOT EXISTS products_type_idx ON products (product_type) WHERE active = true;

