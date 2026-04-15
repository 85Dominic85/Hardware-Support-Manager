import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

let _db: PostgresJsDatabase<typeof schema> | null = null;

export function getDb() {
  if (!_db) {
    const client = postgres(process.env.DATABASE_URL!, {
      prepare: false,       // Required for Supabase Supavisor (transaction mode)
      max: 6,               // Allow concurrent queries — Supavisor handles upstream pooling
      idle_timeout: 30,     // Release idle connections after 30s
      connect_timeout: 10,  // Fail fast on connection issues
      connection: {
        statement_timeout: 15000,  // 15s max per statement — prevents queries from hanging
      },
    });
    _db = drizzle(client, { schema });
  }
  return _db;
}

// Lazy singleton via Proxy — defers getDb() until first property access,
// so DATABASE_URL doesn't need to be available at module import time.
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
