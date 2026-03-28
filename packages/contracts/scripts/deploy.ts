import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Desplegando contratos con la cuenta:", deployer.address);

  // Desplegamos pasando la dirección del deployer como operador
  const simpleAnchor = await ethers.deployContract("SimpleAnchor", [deployer.address]);
  await simpleAnchor.waitForDeployment();

  console.log(`SimpleAnchor desplegado en: ${await simpleAnchor.getAddress()}`);
  console.log("Recuerda agregar esta dirección a la variables de entorno como: SIMPLE_ANCHOR_ADDRESS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
