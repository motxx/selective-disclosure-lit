import * as zkcreds from '~/lib/credentials-bbs-bls';

type PresentationArgs = {
  credentialName: string;
  nameDisclosure: boolean;
  genderDisclosure: boolean;
  countryDisclosure: boolean;
};

export const fetchCredential = async (credentialName: string) => {
  return await downloadCredential(credentialName);
};

export const createPresentation = async (
  verifierAddress: string,
  {
    credentialName,
    nameDisclosure,
    genderDisclosure,
    countryDisclosure,
  }: PresentationArgs,
) => {
  const credential = await downloadCredential(credentialName);
  if (!credential) {
    return null;
  }
  const presentation = await zkcreds.deriveProof(
    credential,
    nameDisclosure,
    genderDisclosure,
    countryDisclosure,
  );
  await uploadPresentation(verifierAddress, presentation);
  return presentation;
};

// TODO: S3やIPFS/Arweaveから取得する
const downloadCredential = async (credentialName: string) => {
  const key = `signedDocument-${credentialName}`;
  const serializedValue = window.localStorage.getItem(key);
  if (serializedValue) {
    return JSON.parse(serializedValue);
  }
  return null;
};

// TODO: S3やIPFS/Arweaveに保存する
const uploadPresentation = async (
  verifierAddress: string,
  presentation: any,
) => {
  const key = `presentation-${verifierAddress}`;
  const serializedValue = JSON.stringify(presentation);
  window.localStorage.setItem(key, serializedValue);
};
