// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * See: https://github.com/d1ll0n/sparse-merkle-tree
 */
contract DefaultHashes {
  constructor() {
    bytes32[160] memory defaultHashes;
    // Set the initial default hash.
    defaultHashes[0] = keccak256(abi.encodePacked(uint256(0)));
    for (uint256 i = 1; i < 160; i ++) defaultHashes[i] = keccak256(abi.encodePacked(defaultHashes[i-1], defaultHashes[i-1]));
    assembly { return(defaultHashes, mul(160, 0x20)) }
  }
}