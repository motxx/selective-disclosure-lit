import { Web3 } from './web3';
import { Bls12381G2KeyPair } from '@mattrglobal/jsonld-signatures-bbs';

export class Base58KeyPairGenerator {
  constructor(private web3: Web3) {}

  async generateBase58KeyPair(): Promise<Bls12381G2KeyPair> {
    const message =
      'BASE58 PRIVATE KEY SEED GENERATOR. DO NOT PUBLISH DERIVED SIGNATURE!';
    const seedPhrase = await this.web3.signAndKeccak256(message);
    return await Bls12381G2KeyPair.generate({
      seed: seedPhrase,
    });
  }
}
