import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import hash from "./utils/cryptography";
import { uintToBytes32 } from "./utils/utils";
import SparseMerkleTree from "@fuel-ts/sparsemerkle";
import DeepSparseMerkleSubTree from "@fuel-ts/sparsemerkle/dist/deepSparseMerkleSubTree";
import SparseCompactMerkleSolidityProof from "@fuel-ts/sparsemerkle/dist/types/sparseCompactMerkleSolidityProof";
import SparseMerkleSolidityNode from "@fuel-ts/sparsemerkle/dist/types/sparseMerkleSolidityNode";
import SparseCompactMerkleBranch from "@fuel-ts/sparsemerkle/dist/types/sparseCompactMerkleBranch";
import { RevocationTreeSMT } from "../typechain";
import { ZERO } from "./utils/constants";
import { MerkleBranchStruct } from "../typechain/RevocationTreeSMT";
import SparseCompactMerkleProof from "@fuel-ts/sparsemerkle/dist/types/sparseCompactMerkleProof";
import { Contract } from "ethers";

describe("RevocationTreeSMT", () => {
  let deployer: SignerWithAddress;
  let sbmtlib: Contract;
  let smtContract: RevocationTreeSMT;

  before(async () => {
    [deployer] = await ethers.getSigners();
    const sparseMerkleFactory = await ethers.getContractFactory("SparseMerkleTree");
    sbmtlib = await sparseMerkleFactory.deploy();
    await sbmtlib.deployed();
  });

  beforeEach(async () => {
    const factory = await ethers.getContractFactory("RevocationTreeSMT", {
      libraries: {
        SparseMerkleTree: sbmtlib.address,
      },
    });
    smtContract = await factory.deploy();
  });

  const buildSolidityProof = (compactMembershipProof: SparseCompactMerkleProof): SparseCompactMerkleSolidityProof => {
    const { SideNodes, NonMembershipLeafData, BitMask, NumSideNodes, SiblingData } = compactMembershipProof;

    return new SparseCompactMerkleSolidityProof(
      SideNodes,
      new SparseMerkleSolidityNode(NonMembershipLeafData),
      BitMask,
      NumSideNodes,
      new SparseMerkleSolidityNode(SiblingData),
    );
  };

  describe("Proof verification", () => {
    const smt = new SparseMerkleTree();
    const data = uintToBytes32(42);

    // SHA256でハッシュ化した値をkeyとして使用する
    const keys = Array.from(
      {
        length: 100,
      },
      (_, i) => hash(uintToBytes32(i)),
    );

    before(() => {
      keys.forEach(key => smt.update(key, data));
    });

    it("checks invalid data against the proof", async () => {
      const keyToProve = keys[51];
      const solidityProof = buildSolidityProof(smt.proveCompacted(keyToProve));
      const badData = uintToBytes32(999);

      expect(await smtContract.verifyCompact(solidityProof, keyToProve, data, smt.root)).to.be.true;
      expect(await smtContract.verifyCompact(solidityProof, keyToProve, badData, smt.root)).to.be.false;
    });

    it("checks non-membership proof", async () => {
      const nonMembershipKey = hash(uintToBytes32(200));
      const solidityProof = buildSolidityProof(smt.proveCompacted(nonMembershipKey));
      const keyToProve = keys[51];

      // non-membership proof: value=ZEROのmemberhsip proof
      expect(await smtContract.verifyCompact(solidityProof, nonMembershipKey, ZERO, smt.root)).to.be.true;
      expect(await smtContract.verifyCompact(solidityProof, keyToProve, ZERO, smt.root)).to.be.false;
    });
  });

  describe("add branches and update", () => {
    const smt = new SparseMerkleTree();
    const data = uintToBytes32(42);
    const newData = uintToBytes32(43);
    const keys = [4, 8, 15, 16, 23, 42].map(num => hash(uintToBytes32(num)));

    before(() => {
      Array.from(
        {
          length: 100,
        },
        (_, i) => hash(uintToBytes32(i)),
      ).forEach(key => smt.update(key, data));
    });

    it("adds branches and updates the tree", async () => {
      const dsmst = new DeepSparseMerkleSubTree(smt.root);
      const branches = addBranches(smt, dsmst, data, keys);

      const keyToUpdate = await updateData(smt, dsmst, smtContract, keys, branches, newData, 3);
      await deleteData(smt, dsmst, smtContract, branches, keyToUpdate);
    });

    const addBranches = (
      smt: SparseMerkleTree,
      dsmst: DeepSparseMerkleSubTree,
      data: string,
      keys: string[],
    ): SparseCompactMerkleBranch[] => {
      return keys.map(key => {
        const compactMembershipProof = smt.proveCompacted(key);
        const res = dsmst.addBranchCompact(compactMembershipProof, key, data);

        // Check proof is valid and branch was successfully added for typescript
        expect(res);

        return new SparseCompactMerkleBranch(buildSolidityProof(compactMembershipProof), key, data);
      });
    };

    const updateData = async (
      smt: SparseMerkleTree,
      dsmst: DeepSparseMerkleSubTree,
      smtContract: RevocationTreeSMT,
      keys: string[],
      branches: MerkleBranchStruct[],
      newData: string,
      keyIndex: number,
    ) => {
      const keyToUpdate = keys[keyIndex];
      await smtContract.addBranchesAndUpdate(branches, smt.root, keyToUpdate, newData);
      smt.update(keyToUpdate, newData);
      dsmst.update(keyToUpdate, newData);

      const solRoot = await smtContract.root();
      expect(dsmst.root).to.equal(smt.root);
      expect(solRoot).to.equal(dsmst.root);

      return keyToUpdate;
    };

    const deleteData = async (
      smt: SparseMerkleTree,
      dsmst: DeepSparseMerkleSubTree,
      smtContract: RevocationTreeSMT,
      branches: MerkleBranchStruct[],
      keyToDelete: string,
    ) => {
      smt.delete(keyToDelete);
      dsmst.delete(keyToDelete);
      await smtContract.addBranchesAndDelete(branches, smt.root, keyToDelete);

      const solRoot = await smtContract.root();
      expect(dsmst.root).to.equal(smt.root);
      expect(solRoot).to.equal(dsmst.root);
    };
  });
});
