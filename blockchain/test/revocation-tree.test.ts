import { ethers } from "hardhat";
import { expect } from "chai";
import hash from "./utils/cryptography";
import { uintToBytes32 } from "./utils/utils";
import SparseMerkleTree from "@fuel-ts/sparsemerkle";
import DeepSparseMerkleSubTree from "@fuel-ts/sparsemerkle/dist/deepSparseMerkleSubTree";
import SparseCompactMerkleSolidityProof from "@fuel-ts/sparsemerkle/dist/types/sparseCompactMerkleSolidityProof";
import SparseMerkleSolidityNode from "@fuel-ts/sparsemerkle/dist/types/sparseMerkleSolidityNode";
import SparseCompactMerkleBranch from "@fuel-ts/sparsemerkle/dist/types/sparseCompactMerkleBranch";
import { RevocationTree } from "../typechain";
import { ZERO } from './utils/constants';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("RevocationTree", () => {
  let deployer: SignerWithAddress;
  let sender: SignerWithAddress;
  let receiver: SignerWithAddress;
  let smtContract: RevocationTree;

  before(async () => {
    [deployer, sender, receiver] = await ethers.getSigners();
		const sparseMerkleFactory = await ethers.getContractFactory('SparseMerkleTree');
		const sbmtlib = await sparseMerkleFactory.deploy();
		await sbmtlib.deployed();
    const factory = await ethers.getContractFactory("RevocationTree", {
      libraries: { SparseMerkleTree: sbmtlib.address },
    });
    smtContract = await factory.deploy();
  });

  const claim = {
    key: "familyName",
    value: "Natori",
  };

  const createTsSMT = async () => {
    // Create a SMT
    const smt = new SparseMerkleTree();
    const data = uintToBytes32(42);

    // Add some leaves
    for (let i = 0; i < 100; i += 1) {
      const key = hash(uintToBytes32(i));
      smt.update(key, data);
    }

    const indexToProve = 51;
    const keyToProve = hash(uintToBytes32(indexToProve));
    const compactMembershipProof = smt.proveCompacted(keyToProve);

    // Need to convert typescript proof (with raw data) into solidity proof (with nodes):
    const proofSideNodes = compactMembershipProof.SideNodes;
    const nonMembershipLeaf = new SparseMerkleSolidityNode(compactMembershipProof.NonMembershipLeafData);
    const bitmask = compactMembershipProof.BitMask;
    const numSideNodes = compactMembershipProof.NumSideNodes;
    const sibling = new SparseMerkleSolidityNode(compactMembershipProof.SiblingData);

    const solidityProof = new SparseCompactMerkleSolidityProof(
      proofSideNodes,
      nonMembershipLeaf,
      bitmask,
      numSideNodes,
      sibling,
    );

    return { solidityProof, keyToProve, data, smt };
  };

  const checkBadData = async (
    solidityProof: SparseCompactMerkleSolidityProof,
    keyToProve: string,
    data: string,
    smt: SparseMerkleTree,
  ) => {
    const badData = uintToBytes32(999);

    // Valid membership proof
    let verified = await smtContract.verifyCompact(solidityProof, keyToProve, data, smt.root);
    expect(verified).to.be.true;
    // Invalid membership proof
    verified = await smtContract.verifyCompact(solidityProof, keyToProve, badData, smt.root);
    expect(verified).to.be.false;
  };

  const checkNonMembership = async (smt: SparseMerkleTree) => {
    const nonMembershipIndex = 200;
    const nonMembershipKey = hash(uintToBytes32(nonMembershipIndex));

    const compactMembershipProof = smt.proveCompacted(nonMembershipKey);

    // Need to convert typescript proof (with raw data) into solidity proof (with nodes):
    const proofSideNodes = compactMembershipProof.SideNodes;
    const nonMembershipLeaf = new SparseMerkleSolidityNode(compactMembershipProof.NonMembershipLeafData);
    const bitmask = compactMembershipProof.BitMask;
    const numSideNodes = compactMembershipProof.NumSideNodes;
    const sibling = new SparseMerkleSolidityNode(compactMembershipProof.SiblingData);

    const solidityProof = new SparseCompactMerkleSolidityProof(
      proofSideNodes,
      nonMembershipLeaf,
      bitmask,
      numSideNodes,
      sibling,
    );

		const indexToProve = 51;
		const keyToProve = hash(uintToBytes32(indexToProve));
    // Valid Non-membership proof
    let verified = await smtContract.verifyCompact(solidityProof, nonMembershipKey, ZERO, smt.root);
    expect(verified).to.be.true;

    // Invalid Non-membership proof
    verified = await smtContract.verifyCompact(solidityProof, keyToProve, ZERO, smt.root);
    expect(verified).to.be.false;
  };

  it("Proof verification", async () => {
    const { solidityProof, keyToProve, data, smt } = await createTsSMT();

    await checkBadData(solidityProof, keyToProve, data, smt);
    await checkNonMembership(smt);
  });
});
