import * as data from './data';
import * as bbs from '@mattrglobal/jsonld-signatures-bbs';
import { sign, verify, extendContextLoader, purposes } from 'jsonld-signatures';

// 本来オンライン上のDIDドキュメントから引っ張ってくる
const documents: { [key: string]: object | string } = {
  // 'did:example:489398593#test': data.keyPairOptions,
  'did:example:489398593': data.exampleControllerDoc,
  'https://w3id.org/security/bbs/v1': data.bbsContext,
  'https://w3id.org/citizenship/v1': data.citizenVocab,
  'https://www.w3.org/2018/credentials/v1': data.credentialContext,
  'https://w3id.org/security/suites/jws-2020/v1': data.suiteContext,
};

const customDocLoader = (url: string): any => {
  const context = documents[url];

  if (context) {
    return {
      contextUrl: null,
      document: context,
      documentUrl: url,
    };
  }

  // TODO: DIDDocumentのストレージから取得する
  if (url === 'did:example:489398593#test') {
    const serializedValue = window.localStorage.getItem(
      'issuer-keypair-options',
    );
    if (serializedValue) {
      return {
        contextUrl: null,
        document: serializedValue,
        documentUrl: url,
      };
    }
  }

  const errorMessage = `Attempted to remote load context : '${url}', please cache instead`;
  console.error(errorMessage);
  throw new Error(errorMessage);
};

const documentLoader = extendContextLoader(customDocLoader);

export const signDocument = async (
  inputDocument: object,
  keyPairOptions: bbs.KeyPairOptions,
) => {
  return sign(inputDocument, {
    suite: new bbs.BbsBlsSignature2020({
      key: getBlsKeyPair(keyPairOptions),
    }),
    purpose: new purposes.AssertionProofPurpose(),
    documentLoader,
  });
};

export const deriveProof = async (
  signedDocument: any,
  nameDisclosure: boolean,
  genderDisclosure: boolean,
  countryDisclosure: boolean,
) => {
  const revealDocument = constructRevealDocument(
    nameDisclosure,
    genderDisclosure,
    countryDisclosure,
  );
  console.log(revealDocument);
  return await bbs.deriveProof(signedDocument, revealDocument, {
    suite: new bbs.BbsBlsSignatureProof2020(),
    documentLoader,
  });
};

export const verifyProof = async (presentation: any) => {
  console.log('presentation', presentation);
  // catchできないWasmのエラーが発生する
  // Uncaught (in promise) RuntimeError: unreachable
  // presentation.proof.proofValue = 'AB';

  const result = await verify(presentation, {
    suite: new bbs.BbsBlsSignatureProof2020(),
    purpose: new purposes.AssertionProofPurpose(),
    documentLoader,
  }).catch((e: Error) => {
    console.error(e);
    return { verified: false, error: e };
  });

  console.log('verified result', result);

  if (result.error) {
    console.error(result.error);
    return false;
  } else {
    return result.verified;
  }
};

const getBlsKeyPair = (keyPairOptions: bbs.KeyPairOptions) => {
  return new bbs.Bls12381G2KeyPair(keyPairOptions);
};

const constructRevealDocument = (
  nameDisclosure: boolean,
  genderDisclosure: boolean,
  countryDisclosure: boolean,
) => {
  return {
    ...data.revealDocumentBase,
    credentialSubject: {
      '@explicit': true,
      type: ['PermanentResident', 'Person'],
      ...(nameDisclosure ? { givenName: {}, familyName: {} } : {}),
      ...(genderDisclosure ? { gender: {} } : {}),
      ...(countryDisclosure ? { birthCountry: {} } : {}),
    },
  };
};
