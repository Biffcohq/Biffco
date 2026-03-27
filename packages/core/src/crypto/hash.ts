import { createHash } from 'crypto'
import type { Buffer } from 'buffer'

/** Helper: hash SHA-256 de un Buffer (para evidencias S3) */
export function hashDocument(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex")
}
