import { ethers } from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import hash from "fuel-merkle-sol/test/utils/cryptography";
import { uintToBytes32 } from "fuel-merkle-sol/test/utils/utils";
import SparseMerkleTree from "@fuel-ts/sparsemerkle";
import DeepSparseMerkleSubTree from "@fuel-ts/sparsemerkle/dist/deepSparseMerkleSubTree";

describe("RevocationTree", () => {
  async function deployContracts() {
    const [deployer, sender, receiver] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("RevocationTree");
    const smtContract = await factory.deploy();
    return { deployer, sender, receiver, smtContract };
  }

  const claim = {
    key: "familyName",
    value: "Natori",
  };

  it("should prove membership", async () => {
    const { deployer, sender, receiver, smtContract } = await loadFixture(deployContracts);

    // Create a SMT
    const smt = new SparseMerkleTree();

    // Add revoked claims
    const key = hash(`${claim.key}=${claim.value}`);
    smt.update(key, "1");

    // Create DSMST (ts) and add some branches from the full SMT using compact proofs:
    const dsmst = new DeepSparseMerkleSubTree(smt.root);

    const branches: SparseCompactMerkleBranch[] = [];

    const keyNumbers = [4, 8, 15, 16, 23, 42];
    const keys: string[] = [];
    for (let i = 0; i < keyNumbers.length; i += 1) {
      keys.push(hash(uintToBytes32(keyNumbers[i])));
    }

    for (let i = 0; i < keys.length; i += 1) {
      const keyToAdd = keys[i];
      const valueToAdd = data;
      const compactMembershipProof = smt.proveCompacted(keyToAdd);
      const res = dsmst.addBranchCompact(compactMembershipProof, keyToAdd, valueToAdd);

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

      branches.push(new SparseCompactMerkleBranch(solidityProof, keyToAdd, valueToAdd));

      // Check proof is valid and branch was successfully added for typescript
      expect(res);
    }

    // UPDATE
    const keyToUpdate = keys[3];
    // Add branches and update on the DSMST (solidity)
    await dsmsto.addBranchesAndUpdate(branches, smt.root, keyToUpdate, newData);
    let solRoot = await dsmsto.root();
    // Update a leaf on the full SMT
    smt.update(keyToUpdate, newData);

    // Update same leaf on the DSMST (ts)
    dsmst.update(keyToUpdate, newData);

    // Check roots are equal
    expect(dsmst.root).to.equal(smt.root);
    expect(solRoot).to.equal(dsmst.root);

    // DELETION
    // Delete the key we just updated
    const keyToDelete = keyToUpdate;

    // Delete a leaf on the full SMT
    smt.delete(keyToDelete);

    // Delete same leaf on the DSMST (ts)
    dsmst.delete(keyToDelete);

    // Add branches and delete on the DSMST (solidity)
    await dsmsto.addBranchesAndDelete(branches, smt.root, keyToDelete);
    solRoot = await dsmsto.root();

    // Check roots are equal
    expect(dsmst.root).to.equal(smt.root);
    expect(solRoot).to.equal(dsmst.root);

    const indexToProve = 51;
    const keyToProve = hash(uintToBytes32(indexToProve));
    let compactMembershipProof = smt.proveCompacted(keyToProve);

    // Need to convert typescript proof (with raw data) into solidity proof (with nodes):
    let proofSideNodes = compactMembershipProof.SideNodes;
    let nonMembershipLeaf = new SparseMerkleSolidityNode(compactMembershipProof.NonMembershipLeafData);
    let bitmask = compactMembershipProof.BitMask;
    let numSideNodes = compactMembershipProof.NumSideNodes;
    let sibling = new SparseMerkleSolidityNode(compactMembershipProof.SiblingData);

    let solidityProof = new SparseCompactMerkleSolidityProof(
      proofSideNodes,
      nonMembershipLeaf,
      bitmask,
      numSideNodes,
      sibling,
    );

    const badData = uintToBytes32(999);

    // Valid membership proof
    // お前の席だから
    // eslint-disable-next-line no-unused-expressions
    await dsmsto.verifyCompact(solidityProof, keyToProve, data, smt.root);
    expect(await dsmsto.verified()).to.be.true;
  });
});
/*
フルのSMTの(?)データ構造のテスト

		const indexToProve = 51;
		const keyToProve = hash(uintToBytes32(indexToProve));
		let compactMembershipProof = smt.proveCompacted(keyToProve);

		// Need to convert typescript proof (with raw data) into solidity proof (with nodes):
		let proofSideNodes = compactMembershipProof.SideNodes;
		let nonMembershipLeaf = new SparseMerkleSolidityNode(
			compactMembershipProof.NonMembershipLeafData
		);
		let bitmask = compactMembershipProof.BitMask;
		let numSideNodes = compactMembershipProof.NumSideNodes;
		let sibling = new SparseMerkleSolidityNode(compactMembershipProof.SiblingData);

		let solidityProof = new SparseCompactMerkleSolidityProof(
			proofSideNodes,
			nonMembershipLeaf,
			bitmask,
			numSideNodes,
			sibling
		);

		const badData = uintToBytes32(999);

		// Valid membership proof
        // お前の席だから
		// eslint-disable-next-line no-unused-expressions
		await dsmsto.verifyCompact(solidityProof, keyToProve, data, smt.root);
		expect(await dsmsto.verified()).to.be.true;

		// Invalid membership proof
        // お前の席ねぇから
		// eslint-disable-next-line no-unused-expressions
		await dsmsto.verifyCompact(solidityProof, keyToProve, badData, smt.root);
		expect(await dsmsto.verified()).to.be.false;
        */
