import { describe, it, expect } from 'vitest'
import { generateMnemonic, isValidMnemonic, mnemonicToSeed } from './bip39'

describe("BIP-39 Mnemonic", () => {
  it("generateMnemonic crea un seed de 24 palabras (256 bits de entropía)", () => {
    const mnemonic = generateMnemonic()
    const words = mnemonic.split(" ")
    expect(words.length).toBe(24)
  })

  it("isValidMnemonic verifica el checksum correctamente", () => {
    const mnemonic = generateMnemonic()
    expect(isValidMnemonic(mnemonic)).toBe(true)
    expect(isValidMnemonic("abandon invalid text test")).toBe(false)
  })

  it("mnemonicToSeed es determinista", () => {
    const m = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
    const seed1 = mnemonicToSeed(m)
    const seed2 = mnemonicToSeed(m)
    expect(seed1.toString("hex")).toBe(seed2.toString("hex"))
  })
})
