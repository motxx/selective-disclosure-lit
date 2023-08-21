import * as LitJsSdk from '@lit-protocol/lit-node-client';
import {
  EncryptedText,
  createAccessControlConditions,
  chain,
} from './constants/encryption';

class Lit {
  public litNodeClient;

  constructor(options: any) {
    this.litNodeClient = new LitJsSdk.LitNodeClient(options);
  }

  async connect() {
    try {
      await this.litNodeClient.connect();
    } catch (error) {
      console.error(`Failed to connect to Lit: ${error}`);
    }
  }

  async encryptText(
    text: string,
    contractAddress: string,
  ): Promise<EncryptedText> {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const unifiedAccessControlConditions =
      createAccessControlConditions(contractAddress);
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      text,
    );
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      unifiedAccessControlConditions,
      symmetricKey,
      authSig,
      chain,
    });

    return {
      encryptedString,
      symmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        'base16',
      ),
    };
  }

  async decryptText(encryptedText: EncryptedText, contractAddress: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const unifiedAccessControlConditions =
      createAccessControlConditions(contractAddress);
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      unifiedAccessControlConditions,
      toDecrypt: encryptedText.symmetricKey,
      chain,
      authSig,
    });
    console.log('encryptedText', encryptedText);

    return await LitJsSdk.decryptString(
      encryptedText.encryptedString,
      symmetricKey,
    );
  }
}

const lit = new Lit({ alertWhenUnauthorized: false });
lit.connect();

export { lit };
