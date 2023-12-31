import * as store from '~/lib/credentials/store';
import * as zkcreds from '~/lib/credentials/bbs-bls';
import { Web3 } from '~/lib/web3';

export const verifyPresentation = async (presentation: any) => {
  const res = await zkcreds.verifyProof(presentation).catch((e) => {
    console.error(e);
    return false;
  });
  return res;
};

export const downloadPresentation = async (credentialName: string) => {
  const web3 = await Web3.connectWallet();
  const verifierId = await web3.getAddress();
  return await store.downloadPresentation(verifierId, credentialName);
};
