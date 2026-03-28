import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

// Cargar env vars desde el root o local (mockeable en dev)
dotenv.config({ path: "../../.env" });
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    amoy: {
      url: process.env.POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology",
      accounts: process.env.POLYGON_PRIVATE_KEY 
        ? [process.env.POLYGON_PRIVATE_KEY] 
        : ["0x0000000000000000000000000000000000000000000000000000000000000001"], // Mock account para que hardhat inicialice
      chainId: 80002,
    },
    hardhat: {
      chainId: 1337 // Red de prueba local rápida
    }
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || "mock-api-key"
    }
  }
};

export default config;
