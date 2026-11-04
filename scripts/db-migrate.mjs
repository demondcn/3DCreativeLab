import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { Pool } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const client = await pool.connect();

try {
  await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    filename text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`);
  const files = (await readdir("neon/migrations")).filter((name) => name.endsWith(".sql")).sort();
  const applied = new Set((await client.query("SELECT filename FROM schema_migrations")).rows.map((row) => row.filename));
  for (const filename of files) {
    if (applied.has(filename)) continue;
    const sql = await readFile(join("neon/migrations", filename), "utf8");
    await client.query("BEGIN");
    try {
      await client.query(sql);
      await client.query("INSERT INTO schema_migrations (filename) VALUES ($1)", [filename]);
      await client.query("COMMIT");
      console.log(`Applied ${filename}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  }
  console.log("Database migrations are current.");
} finally {
  client.release();
  await pool.end();
}
