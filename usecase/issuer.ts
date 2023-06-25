import { KeyPairOptions } from '@mattrglobal/jsonld-signatures-bbs';
import * as zkcreds from '~/lib/credentials-bbs-bls';

export const issueCredential = async (
  holderAddress: string,
  credentialName: string,
  inputDocument: object,
) => {
  console.log(inputDocument);
  const keyPairOptions = await zkcreds.generateMockKeyPairOptions();
  const signedDocument = await zkcreds.signDocument(
    inputDocument,
    keyPairOptions,
  );
  await save(credentialName, signedDocument, keyPairOptions);
};

// TODO: S3やIPFS/Arweaveに保存する
const save = async (
  credentialName: string,
  signedDocument: any,
  keyPairOptions: KeyPairOptions,
) => {
  const key = `signedDocument-${credentialName}`;
  const serializedValue = JSON.stringify(signedDocument);
  window.localStorage.setItem(key, serializedValue);
  window.localStorage.setItem(
    'issuer-keypair-options', // TODO: DIDDocumentとして引けるようにする
    JSON.stringify({
      ...keyPairOptions,
      privateKeyBase58: undefined,
    }),
  );
};
