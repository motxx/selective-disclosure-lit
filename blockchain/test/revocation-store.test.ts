import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { RevocationStore } from "../typechain";
import { expect } from "chai";

describe("RevocationStore", () => {
  let deployer: SignerWithAddress;
  let contract: RevocationStore;

  before(async () => {
    [deployer] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("RevocationStore");
    contract = await factory.deploy();
  });

  it("should revoke", async () => {
    const revokedClaim = "name:Natori Sana,nonce:1234";
    let key = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(revokedClaim));
    contract.revoke(key);
    expect(await contract.isRevoked(key)).to.be.true;
    const notRevokedClaim = "name:名取さな,nonce:1234";
    key = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(notRevokedClaim));
    expect(await contract.isRevoked(key)).to.be.false;
  });
});
