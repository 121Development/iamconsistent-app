import { getDb } from '../lib/db'
import { getWebRequest } from 'vinxi/http'

// Helper to get the database instance from the request context
export function getDbFromContext() {
  // In Cloudflare Workers with TanStack Start, env is available on the request context
  const request = getWebRequest()
  const env = (request as any).cloudflare?.env as Cloudflare.Env | undefined

  if (!env || !env['iamconsistent-app']) {
    throw new Error('Database binding not found. Make sure D1 is configured in wrangler.jsonc')
  }

  return getDb(env['iamconsistent-app'])
}
