import { describe, it, expect } from 'vitest'
import { hashDocument } from './hash'

describe("Hash SHA-256", () => {
  it("hashea el buffer consistentemente", () => {
    const buffer = Buffer.from("hello world")
    const hash = hashDocument(buffer)
    expect(hash).toBe("b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9")
  })
})
