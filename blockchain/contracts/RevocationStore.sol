// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract RevocationStore {
  mapping(address => mapping(bytes32 => bool)) public revocations;

  function revoke(bytes32 _key) external {
    // TODO: Support MetaTx
    revocations[msg.sender][_key] = true;
  }

  function isRevoked(bytes32 _key) external view returns (bool) {
    return revocations[msg.sender][_key];
  }
}
