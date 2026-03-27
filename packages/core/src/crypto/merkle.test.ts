import { describe, it, expect } from 'vitest'
import { MerkleTree } from './merkle'
import { createHash } from 'crypto'

describe("MerkleTree", () => {
  it("construye la raíz y permite verificar una prueba de 100 eventos", () => {
    const leaves = Array.from({ length: 100 }, (_, i) => `evento-${i}`)
    
    const tree = new MerkleTree(leaves)
    const root = tree.getRoot()
    
    expect(typeof root).toBe("string")
    expect(root.length).toBe(64) // sha256
    
    // Verificamos prueba manual reconstruyendo hacia arriba
    const leafIndex = 42
    const targetLeaf = leaves[leafIndex]!
    const hashedTarget = createHash("sha256").update(targetLeaf).digest("hex")
    
    const proof = tree.getProof(leafIndex)
    
    let currentHash = hashedTarget
    let idx = leafIndex
    
    for (const siblingHash of proof) {
      const isRight = idx % 2 === 1
      const left = isRight ? siblingHash : currentHash
      const right = isRight ? currentHash : siblingHash
      currentHash = createHash("sha256").update(left + right).digest("hex")
      idx = Math.floor(idx / 2)
    }
    
    expect(currentHash).toBe(root) // ¡Match! El evento es válido según la raíz
  })

  it("falla si intentamos inicializarlo vacío", () => {
    expect(() => new MerkleTree([])).toThrow()
  })
})
