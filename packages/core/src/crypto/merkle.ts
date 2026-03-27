import { createHash } from 'crypto'

/**
 * Árbol de Merkle con SHA-256.
 * Se usa para calcular la raíz de un batch de eventos antes de anclarlos en Polygon.
 * La raíz del árbol es lo que se publica en el smart contract.
 * Cada evento puede ser verificado contra la raíz sin necesidad de todos los demás.
 */
export class MerkleTree {
  private readonly leaves: string[]
  private readonly tree: string[][]

  constructor(leaves: string[]) {
    if (leaves.length === 0) throw new Error("MerkleTree: al menos 1 hoja requerida")
    this.leaves = leaves.map(l => this.hash(l))
    this.tree = this.buildTree(this.leaves)
  }

  /** SHA-256 de un string, retorna hex */
  private hash(data: string): string {
    return createHash("sha256").update(data).digest("hex")
  }

  private buildTree(leaves: string[]): string[][] {
    if (leaves.length === 1) return [leaves]

    const levels: string[][] = [leaves]
    let current = leaves

    while (current.length > 1) {
      const next: string[] = []
      for (let i = 0; i < current.length; i += 2) {
        const left = current[i] ?? ""
        const right = current[i + 1] ?? current[i] ?? "" // Duplicar si número impar
        next.push(this.hash(left + right))
      }
      levels.push(next)
      current = next
    }

    return levels
  }

  /** La raíz del árbol — lo que se ancla en Polygon */
  getRoot(): string {
    const lastLevel = this.tree[this.tree.length - 1]
    if (!lastLevel || !lastLevel[0]) throw new Error("MerkleTree: árbol vacío")
    return lastLevel[0]
  }

  /** Prueba de que una hoja pertenece al árbol */
  getProof(leafIndex: number): string[] {
    const proof: string[] = []
    let index = leafIndex

    for (let level = 0; level < this.tree.length - 1; level++) {
      const currentLevel = this.tree[level]!
      const isRight = index % 2 === 1
      const siblingIndex = isRight ? index - 1 : index + 1

      if (siblingIndex < currentLevel.length) {
        proof.push(currentLevel[siblingIndex]!)
      }

      index = Math.floor(index / 2)
    }

    return proof
  }
}
