import * as store from '~/lib/credentials/store';
import * as zkcreds from '~/lib/credentials/bbs-bls';

export const issueCredential = async (
  holderId: string,
  credentialName: string,
  inputDocument: object,
) => {
  const keyPairOptions = await zkcreds.generateMockKeyPairOptions();
  await store.uploadKeyPair('Issuer-KeyPair-DIDKey', keyPairOptions);

  const signedDocument = await zkcreds.signDocument(
    inputDocument,
    keyPairOptions,
  );
  await store.uploadCredential(holderId, credentialName, signedDocument);
};
