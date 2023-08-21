import { ethers } from 'ethers';
import { RevocationStore as ContractAddress } from './constants/contract-address';
import Artifact from './constants/RevocationStore.json';

export class RevocationStore {
  private contract: ethers.Contract;
  constructor() {
    const contractAddress = ContractAddress.mumbai;
    this.contract = new ethers.Contract(
      contractAddress,
      Artifact.abi,
      new ethers.InfuraProvider(process.env.INFURA_PROJECT_ID),
    );
  }
}
