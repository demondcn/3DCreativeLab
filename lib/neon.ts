import { Pool } from "@neondatabase/serverless";

export function hasDatabaseEnv() {
  return Boolean(process.env.DATABASE_URL);
}

let pool: Pool | undefined;

export function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL no está configurada.");
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL });
  return async <T extends Record<string, unknown> = Record<string, unknown>>(strings: TemplateStringsArray, ...values: unknown[]) => {
    const text = strings.reduce((query, part, index) => query + part + (index < values.length ? `$${index + 1}` : ""), "");
    const result = await pool!.query(text, values);
    return result.rows as T[];
  };
}

