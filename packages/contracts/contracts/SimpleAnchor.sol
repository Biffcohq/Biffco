// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * SimpleAnchor — contrato de anclaje para BIFFCO.
 *
 * Función: recibir una raíz de Merkle (bytes32) y emitir un evento.
 * El evento queda permanentemente registrado en el blockchain.
 * Cualquier nodo puede verificar que la raíz fue publicada en el bloque N.
 *
 * NO almacena nada en storage. Solo emite eventos.
 * Esto minimiza el gas cost — solo el costo del evento (log).
 */
contract SimpleAnchor {
  // El único evento del contrato
  event MerkleRootAnchored(
    bytes32 indexed merkleRoot,
    uint256 indexed timestamp,
    string batchId         // correlationId del batch de eventos
  );

  // La wallet autorizada a anclar
  address public immutable operator;

  constructor(address _operator) {
    operator = _operator;
  }

  function anchor(
    bytes32 merkleRoot,
    string calldata batchId
  ) external {
    require(msg.sender == operator, "Solo el operador puede anclar");
    require(merkleRoot != bytes32(0), "MerkleRoot no puede ser cero");

    emit MerkleRootAnchored(merkleRoot, block.timestamp, batchId);
  }
}
