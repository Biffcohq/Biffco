import { ethers } from 'ethers';
import { env } from '@biffco/config';

// Interfaz mínima del contrato SimpleAnchor
const SIMPLE_ANCHOR_ABI = [
  "function anchor(bytes32 merkleRoot, string calldata batchId) external",
  "event MerkleRootAnchored(bytes32 indexed merkleRoot, uint256 indexed timestamp, string batchId)"
];

export class PolygonProvider {
  private provider: ethers.JsonRpcProvider | null = null;
  private contract: ethers.Contract | null = null;

  private getContract(): ethers.Contract {
    if (this.contract) return this.contract;
    
    const rpcUrl = env.POLYGON_RPC_URL ?? "https://rpc-amoy.polygon.technology";
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // Si no hay llave real en DEV, usamos una de prueba que igual fallará si hace transaction pero sirve para inicializar
    const pk = env.POLYGON_PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";
    const wallet = new ethers.Wallet(pk, this.provider);
    
    this.contract = new ethers.Contract(
      env.SIMPLE_ANCHOR_ADDRESS || "0x0000000000000000000000000000000000000000",
      SIMPLE_ANCHOR_ABI,
      wallet
    );
    return this.contract;
  }

  /**
   * Ancla una raíz de Merkle en Polygon.
   * @returns txHash de la transacción
   */
  async anchor(merkleRoot: string, batchId: string): Promise<string> {
    const isMock = !env.POLYGON_PRIVATE_KEY;
    if (isMock) {
      // En dev: mock del txHash para no gastar MATIC de prueba si no hay config
      console.info(`[Polygon MOCK] anchor(${merkleRoot.slice(0, 8)}..., ${batchId})`);
      return `0xmock_tx_${Date.now()}`;
    }

    try {
      const contract = this.getContract() as any;
      const rootBytes32 = merkleRoot.startsWith("0x") ? merkleRoot : `0x${merkleRoot}`;
      
      console.info(`[Polygon] Enviando tx de anclaje para batchId ${batchId}...`);
      const tx = await contract.anchor(rootBytes32, batchId);
      
      console.info(`[Polygon] Esperando confirmación de la tx ${tx.hash}...`);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (e) {
      console.error("[Polygon ERROR]", e);
      throw e;
    }
  }
}

export const polygonProvider = new PolygonProvider();
