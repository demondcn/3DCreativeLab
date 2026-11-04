import { Pool } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const connection = (await pool.query("select current_database() as database_name, version() as postgres_version")).rows;
const tables = (await pool.query("select to_regclass('public.products') as products")).rows;
const columns = tables[0].products
  ? (await pool.query("select column_name, data_type, is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'products' order by ordinal_position")).rows
  : [];

console.log(JSON.stringify({
  connected: Boolean(connection[0]?.database_name),
  postgres: connection[0]?.postgres_version?.split(" ").slice(0, 2).join(" "),
  productsTable: Boolean(tables[0].products),
  columns,
}, null, 2));
await pool.end();
