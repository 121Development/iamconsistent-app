import { drizzle } from 'drizzle-orm/d1'
import * as schema from './schema'

// Type for the D1 database binding
export type D1Database = {
  prepare: (query: string) => any
  dump: () => Promise<ArrayBuffer>
  batch: <T = unknown>(statements: any[]) => Promise<T[]>
  exec: (query: string) => Promise<any>
}

// Initialize Drizzle with D1 binding
export function getDb(d1: D1Database) {
  return drizzle(d1, { schema })
}

// Type for the database client
export type DbClient = ReturnType<typeof getDb>
