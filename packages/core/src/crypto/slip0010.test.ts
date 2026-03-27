import { describe, it, expect } from 'vitest'
import { deriveKeyFromMnemonic, buildDerivationPath } from './slip0010'
import { Buffer } from 'buffer'

const TEST_MNEMONIC = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"

describe("SLIP-0010 derivación", () => {
  it("misma semilla + mismo path → mismo keypair (determinista)", () => {
    const kp1 = deriveKeyFromMnemonic(TEST_MNEMONIC, 1, 0)
    const kp2 = deriveKeyFromMnemonic(TEST_MNEMONIC, 1, 0)
    expect(Buffer.from(kp1.publicKey).toString("hex"))
      .toBe(Buffer.from(kp2.publicKey).toString("hex"))
  })

  it("distintos wsIdx → claves matemáticamente distintas", () => {
    const ws1 = deriveKeyFromMnemonic(TEST_MNEMONIC, 1, 0)
    const ws2 = deriveKeyFromMnemonic(TEST_MNEMONIC, 2, 0)
    expect(Buffer.from(ws1.publicKey).toString("hex"))
      .not.toBe(Buffer.from(ws2.publicKey).toString("hex"))
  })

  it("distintos memberIdx → claves distintas (miembros distintos del mismo WS)", () => {
    const m0 = deriveKeyFromMnemonic(TEST_MNEMONIC, 1, 0)
    const m1 = deriveKeyFromMnemonic(TEST_MNEMONIC, 1, 1)
    expect(Buffer.from(m0.publicKey).toString("hex"))
      .not.toBe(Buffer.from(m1.publicKey).toString("hex"))
  })

  it("path de derivación tiene el formato correcto", () => {
    expect(buildDerivationPath(1, 0)).toBe("m/0'/1'/0'")
    expect(buildDerivationPath(5, 3)).toBe("m/0'/5'/3'")
  })
})
