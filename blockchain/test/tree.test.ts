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
  let sbmtlib: SparseMerkleTree;
  let smtContract: RevocationTree;

  before(async () => {
    const sparseMerkleFactory = await ethers.getContractFactory("SparseMerkleTree");
    sbmtlib = await sparseMerkleFactory.deploy();
    await sbmtlib.deployed();
  });

  beforeEach(async () => {
    const revocationTreeFactory = await ethers.getContractFactory("RevocationTree", {
      libraries: { SparseMerkleTree: sbmtlib.address },
    });
    smtContract = await revocationTreeFactory.deploy();
    await smtContract.deployed();
  });

  describe("Proof verification", () => {
    it("should verify membership proof", async () => {
      const smt = new TsSparseMerkleTree();
      const data = uintToBytes32(42);

      for (let i = 0; i < 100; i += 1) {
        const key = hash(uintToBytes32(i));
        smt.update(key, data);
      }

      const keyToProve = hash(uintToBytes32(51));
      const compactMembershipProof = smt.proveCompacted(keyToProve);
      const solidityProof = convertToSolidityProof(compactMembershipProof);

      const badData = uintToBytes32(999);

      await verifyMembershipProof(smtContract, solidityProof, keyToProve, data, smt.root);
      await verifyNonMembershipProof(smtContract, solidityProof, keyToProve, badData, smt.root);
    });
  });

  describe("Adding branches and updating", () => {
    it("should add branches and update", async () => {
      const smt = new TsSparseMerkleTree();
      const data = uintToBytes32(42);
      const newData = uintToBytes32(43);

      for (let i = 0; i < 100; i += 1) {
        const key = hash(uintToBytes32(i));
        smt.update(key, data);
      }

      const dsmst = new TsDeepSparseMerkleSubTree(smt.root);
      const branches = createBranches(smt, data, [4, 8, 15, 16, 23, 42]);

      const keyToUpdate = hash(uintToBytes32(16));
      await addBranchesAndUpdate(smtContract, branches, smt.root, keyToUpdate, newData);
      const solRoot = await smtContract.root();

      smt.update(keyToUpdate, newData);
      dsmst.update(keyToUpdate, newData);

      expect(dsmst.root).to.equal(smt.root);
      expect(solRoot).to.equal(dsmst.root);

      const keyToDelete = keyToUpdate;

      smt.delete(keyToDelete);
      dsmst.delete(keyToDelete);

      await addBranchesAndDelete(smtContract, branches, smt.root, keyToDelete);
      const solRootAfterDeletion = await smtContract.root();

      expect(dsmst.root).to.equal(smt.root);
      expect(solRootAfterDeletion).to.equal(dsmst.root);
    });
  });

  async function verifyMembershipProof(
    contract: RevocationTree,
    proof: SparseCompactMerkleSolidityProof,
    key: string,
    value: string,
    root: string,
  ) {
    const verified = await contract.verifyCompact(proof, key, value, root);
    expect(verified).to.be.true;
  }

  async function verifyNonMembershipProof(
    contract: RevocationTree,
    proof: SparseCompactMerkleSolidityProof,
    key: string,
    value: string,
    root: string,
  ) {
    const verified = await contract.verifyCompact(proof, key, value, root);
    expect(verified).to.be.false;
  }

  function convertToSolidityProof(compactProof: any): SparseCompactMerkleSolidityProof {
    const { SideNodes, NonMembershipLeafData, BitMask, NumSideNodes, SiblingData } = compactProof;

    const proofSideNodes = SideNodes;
    const nonMembershipLeaf = new SparseMerkleSolidityNode(NonMembershipLeafData);
    const bitmask = BitMask;
    const numSideNodes = NumSideNodes;
    const sibling = new SparseMerkleSolidityNode(SiblingData);

    return new SparseCompactMerkleSolidityProof(proofSideNodes, nonMembershipLeaf, bitmask, numSideNodes, sibling);
  }

  function createBranches(smt: TsSparseMerkleTree, data: string, keyNumbers: number[]): SparseCompactMerkleBranch[] {
    return keyNumbers.map(num => {
      const keyToAdd = hash(uintToBytes32(num));
      const compactMembershipProof = smt.proveCompacted(keyToAdd);
      const solidityProof = convertToSolidityProof(compactMembershipProof);

      return new SparseCompactMerkleBranch(solidityProof, keyToAdd, data);
    });
  }

  async function addBranchesAndUpdate(
    contract: RevocationTree,
    branches: SparseCompactMerkleBranch[],
    root: string,
    key: string,
    newValue: string,
  ) {
    await contract.addBranchesAndUpdate(branches, root, key, newValue);
  }

  async function addBranchesAndDelete(
    contract: RevocationTree,
    branches: SparseCompactMerkleBranch[],
    root: string,
    key: string,
  ) {
    await contract.addBranchesAndDelete(branches, root, key);
  }
});
