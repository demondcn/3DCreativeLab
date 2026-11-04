import { Pool } from "@neondatabase/serverless";

if (!process.env.NEON_AUTH_BASE_URL || !process.env.DATABASE_URL) throw new Error("Neon Auth variables are required.");
const response = await fetch(`${process.env.NEON_AUTH_BASE_URL}/get-session`, {
  headers: { origin: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000" },
});
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const tables = (await pool.query("select table_name from information_schema.tables where table_schema='neon_auth' order by table_name")).rows.map((row) => row.table_name);
const adminAccountPresent = tables.includes("user") && process.env.ADMIN_EMAIL
  ? Number((await pool.query('select count(*)::int as count from neon_auth."user" where lower(email)=lower($1)', [process.env.ADMIN_EMAIL])).rows[0].count) > 0
  : false;
console.log(JSON.stringify({ endpointReachable: response.status < 500, anonymousStatus: response.status, authSchemaPresent: tables.length > 0, authTableCount: tables.length, adminAccountPresent }));
await pool.end();
if (response.status >= 500 || tables.length === 0) process.exitCode = 1;
