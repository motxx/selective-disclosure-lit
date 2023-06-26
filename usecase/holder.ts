import * as store from '~/lib/credentials-storage';
import { Web3 } from '~/lib/web3';
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
  verifierId: string,
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
  await store.uploadPresentation(verifierId, credentialName, presentation);
  return presentation;
};

const downloadCredential = async (credentialName: string) => {
  const web3 = await Web3.connectWallet();
  const holderId = await web3.getAddress();
  return await store.downloadCredential(holderId, credentialName);
};
