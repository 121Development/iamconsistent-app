import { drizzle } from 'drizzle-orm/d1'
import * as schema from "../../lib/db/schema";

export interface Env {
  // This must match the binding name in your wrangler.toml
  DB: D1Database;
}

export const createDb = (d1: D1Database) =>
  drizzle(d1, { schema }); // schema is optional but useful for typing

