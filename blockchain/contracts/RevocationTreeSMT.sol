// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//import "../node_modules/fuel-merkle-sol/contracts/tree/sparse/SparseMerkleTree.sol";
import "fuel-merkle-sol/contracts/tree/sparse/SparseMerkleTree.sol";

contract RevocationTreeSMT {
  bytes32 public root;

  function verifyCompact(
    SparseCompactMerkleProof memory _proof,
    bytes32 _key,
    bytes memory _value,
    bytes32 _root
  ) public pure returns (bool) {
    return SparseMerkleTree.verifyCompact(_proof, _key, _value, _root);
  }

  function addBranchesAndUpdate(
    MerkleBranch[] memory _branches,
    bytes32 _root,
    bytes32 _key,
    bytes memory _value
  ) public {
    root = SparseMerkleTree.addBranchesAndUpdate(_branches, _root, _key, _value);
  }

  function addBranchesAndDelete(MerkleBranch[] memory _branches, bytes32 _root, bytes32 _key) public {
    root = SparseMerkleTree.addBranchesAndDelete(_branches, _root, _key);
  }
}
