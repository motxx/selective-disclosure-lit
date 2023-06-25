import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}
/**
 * Web3 client connecting to MetaMask's infra nodes.
 */
export class Web3 {
  private constructor(
    public provider: ethers.BrowserProvider,
    public signer: ethers.JsonRpcSigner,
  ) {}

  /**
   * Factory to create a client connected to the web3.
   * @returns A client instance connected to the web3.
   */
  static async connectWallet(): Promise<Web3> {
    if (!window.ethereum) {
      throw new Error('Metamask not installed');
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Web3(provider, signer);
  }

  /**
   * Gets the wallet address.
   * @returns A promise for the wallet address.
   */
  async getAddress() {
    return await this.signer.getAddress();
  }

  async sign(message: string) {
    return await this.signer.signMessage(message);
  }

  async signAndKeccak256(message: string) {
    const signature = await this.sign(message);
    return ethers.getBytes(ethers.keccak256(signature));
  }
}
