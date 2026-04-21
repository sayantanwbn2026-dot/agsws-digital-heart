import type { VercelRequest } from '@vercel/node'
import { timingSafeEqual } from 'crypto'

/**
 * Verifies an admin Bearer token against the server-side ADMIN_API_TOKEN env var.
 * Uses constant-time comparison to prevent timing attacks.
 * Returns true only if the token is present, well-formed, and matches.
 */
export function verifyAdmin(req: VercelRequest): boolean {
  const expected = process.env.ADMIN_API_TOKEN
  if (!expected) {
    // Fail closed: if no admin token is configured server-side, deny everything.
    console.error('[verifyAdmin] ADMIN_API_TOKEN env var is not configured')
    return false
  }

  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7).trim() : ''
  if (!token) return false

  const a = Buffer.from(token)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false

  try {
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}