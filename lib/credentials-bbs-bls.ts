import { KeyPairOptions } from '@mattrglobal/jsonld-signatures-bbs';
import { Base58KeyPairGenerator } from './base58-key-pair-generator';
import * as bbs from './credentials-bbs/bbs-bls-signature';
import { Web3 } from './web3';

export const generateMockKeyPairOptions = async (): Promise<KeyPairOptions> => {
  const web3 = await Web3.connectWallet();
  const keyPairGenerator = new Base58KeyPairGenerator(web3);
  const keyPair = await keyPairGenerator.generateBase58KeyPair();
  return {
    id: 'did:example:489398593#test',
    controller: 'did:example:489398593',
    privateKeyBase58: keyPair.privateKey,
    publicKeyBase58: keyPair.publicKey,
  };
};

export const signDocument = async (
  inputDocument: object,
  keyPair: KeyPairOptions,
) => {
  const signedDocument = await bbs.signDocument(inputDocument, keyPair);
  console.log(JSON.stringify(signedDocument));
  return signedDocument;
};

export const deriveProof = async (
  signedDocument: any,
  nameDisclosure: boolean,
  genderDisclosure: boolean,
  countryDisclosure: boolean,
) => {
  return await bbs.deriveProof(
    signedDocument,
    nameDisclosure,
    genderDisclosure,
    countryDisclosure,
  );
};

export const verifyProof = async (presentation: any) => {
  const res = await bbs.verifyProof(presentation).catch((e) => {
    console.error(e);
    return false;
  });
  return res;
};
