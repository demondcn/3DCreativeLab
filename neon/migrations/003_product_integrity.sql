ALTER TABLE products DROP CONSTRAINT IF EXISTS products_makerworld_url_check;
ALTER TABLE products
  ADD CONSTRAINT products_makerworld_url_check
  CHECK (makerworld_url IS NULL OR makerworld_url = '' OR makerworld_url ~ '^https://([^/]+\.)?makerworld\.com/');

ALTER TABLE products DROP CONSTRAINT IF EXISTS products_image_count_check;
ALTER TABLE products
  ADD CONSTRAINT products_image_count_check CHECK (cardinality(image_urls) <= 6);

