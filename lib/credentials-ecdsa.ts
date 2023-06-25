import * as EcdsaMultikey from '@digitalbazaar/ecdsa-multikey';
import * as ecdsaSd2023Cryptosuite from '@digitalbazaar/ecdsa-sd-2023-cryptosuite';
import { DataIntegrityProof } from '@digitalbazaar/data-integrity';
import jsigs from 'jsonld-signatures';
import { unsignedCredential } from './credentials-ecdsa/example/unsignedCredential';
import { loader } from './credentials-ecdsa/example/documentLoader.js';
import { EcdsaMultikeyKeyPair } from './credentials-ecdsa/types';

const { createSignCryptosuite, createDiscloseCryptosuite } =
  ecdsaSd2023Cryptosuite;

const {
  purposes: { AssertionProofPurpose },
} = jsigs;

export class CredentialsECDSA {
  private documentLoader: any;

  constructor(private keyPair: any) {
    this.documentLoader = loader.build();
  }

  async createBaseProof(mandatoryPointers: string[]) {
    const suite = new DataIntegrityProof({
      signer: this.keyPair.signer(),
      cryptosuite: createSignCryptosuite({
        mandatoryPointers, // : '/credentialSubject/driverLicense/issuingAuthority',
      }),
    });

    return await this.signCredential(suite);
  }

  async deriveProof(signedCredential: any, selectivePointers: string[]) {
    const suite = new DataIntegrityProof({
      cryptosuite: createDiscloseCryptosuite({
        selectivePointers, // : ['/credentialSubject/driverLicense/dateOfBirth'],
      }),
    });
    return await this.deriveCredential(signedCredential, suite);
  }

  private async signCredential(suite: any) {
    return await jsigs.sign(unsignedCredential, {
      suite,
      purpose: new AssertionProofPurpose(),
      documentLoader: this.documentLoader,
    });
  }

  private async deriveCredential(signedCredential: any, suite: any) {
    return await jsigs.derive(signedCredential, {
      suite,
      purpose: new AssertionProofPurpose(),
      documentLoader: this.documentLoader,
    });
  }

  /**
   * 下記を読んで適切なキーペアを考える
   * https://qiita.com/kazuhideYS/items/598b0f8da19deacf57ca
   */
  public async generateDidKeyMockKeyPair() {
    // base58-bitcoin
    const publicKeyMultibase =
      'zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9';
    const secretKeyMultibase =
      'z42tqZ5smVag3DtDhjY9YfVwTMyVHW6SCHJi2ZMrD23DGYS3';
    const controller = `did:key:${publicKeyMultibase}`;
    const keyId = `${controller}#${publicKeyMultibase}`;
    const ecdsaMultikeyKeyPair: EcdsaMultikeyKeyPair = {
      '@context': 'https://w3id.org/security/multikey/v1',
      type: 'Multikey',
      controller,
      id: keyId,
      publicKeyMultibase,
      secretKeyMultibase,
    };
    return await EcdsaMultikey.from({ ...ecdsaMultikeyKeyPair });
  }
}
