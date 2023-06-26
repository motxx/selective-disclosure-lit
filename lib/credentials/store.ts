import { KeyPairOptions } from '@mattrglobal/jsonld-signatures-bbs';

export const uploadCredential = async (
  receiverId: string,
  credentialName: string,
  credential: any,
) => {
  const key = documentKey(receiverId, credentialDocumentName(credentialName));
  await uploadDocument(receiverId, key, credential);
};

export const uploadPresentation = async (
  receiverId: string,
  credentialName: string,
  presentation: any,
) => {
  const key = documentKey(receiverId, presentationDocumentName(credentialName));
  await uploadDocument(receiverId, key, presentation);
};

export const uploadKeyPair = async (
  issuerId: string,
  keyPairOptions: KeyPairOptions,
) => {
  window.localStorage.setItem(
    issuerId,
    JSON.stringify({
      ...keyPairOptions,
      privateKeyBase58: undefined,
    }),
  );
};

export const downloadCredential = async (
  receiverId: string,
  credentialName: string,
) => {
  const key = documentKey(receiverId, credentialDocumentName(credentialName));
  return downloadDocument(receiverId, key);
};

export const downloadPresentation = async (
  receiverId: string,
  credentialName: string,
) => {
  const key = documentKey(receiverId, presentationDocumentName(credentialName));
  return downloadDocument(receiverId, key);
};

const uploadDocument = async (
  receiverId: string,
  key: string,
  document: any,
) => {
  const serializedValue = JSON.stringify(document);
  window.localStorage.setItem(key, serializedValue);
};

const downloadDocument = async (receiverId: string, key: string) => {
  const serializedValue = window.localStorage.getItem(key);
  return serializedValue ? JSON.parse(serializedValue) : null;
};

const documentKey = (receiverId: string, documentName: string) => {
  return `${receiverId}/${documentName}`;
};

const credentialDocumentName = (credentialName: string) => {
  return `credential/${credentialName}`;
};

const presentationDocumentName = (credentialName: string) => {
  return `presentation/${credentialName}`;
};
