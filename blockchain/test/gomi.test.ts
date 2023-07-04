import chai from "chai";
import { solidity } from "ethereum-waffle";
import { ethers } from "hardhat";
import TsSparseMerkleTree from "@fuel-ts/sparsemerkle";
import TsDeepSparseMerkleSubTree from "@fuel-ts/sparsemerkle/dist/deepSparseMerkleSubTree";
import SparseCompactMerkleSolidityProof from "@fuel-ts/sparsemerkle/dist/types/sparseCompactMerkleSolidityProof";
import SparseMerkleSolidityNode from "@fuel-ts/sparsemerkle/dist/types/sparseMerkleSolidityNode";
import SparseCompactMerkleBranch from "@fuel-ts/sparsemerkle/dist/types/sparseCompactMerkleBranch";
import { uintToBytes32 } from "./utils/utils";
import hash from "./utils/cryptography";
import { RevocationTree, SparseMerkleTree } from "../typechain";

chai.use(solidity);
const { expect } = chai;

describe("Sparse Merkle Tree", async () => {
  before(async () => {});

  describe("Proof verification", () => {
    it("shine ", async () => {
      expect("gomikasu").to.equals("gomikasu");
    });
  });
});
