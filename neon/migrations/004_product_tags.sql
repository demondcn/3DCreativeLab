ALTER TABLE products
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

ALTER TABLE products DROP CONSTRAINT IF EXISTS products_tags_count_check;
ALTER TABLE products
  ADD CONSTRAINT products_tags_count_check CHECK (cardinality(tags) <= 12);

CREATE INDEX IF NOT EXISTS products_tags_idx ON products USING gin (tags);
