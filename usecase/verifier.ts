import * as zkcreds from '~/lib/credentials-bbs-bls';
import { Web3 } from '~/lib/web3';

export const verifyPresentation = async (presentation: any) => {
  const res = await zkcreds.verifyProof(presentation).catch((e) => {
    console.error(e);
    return false;
  });
  return res;
};

export const downloadPresentation = async () => {
  const web3 = await Web3.connectWallet();
  const verifierAddress = await web3.getAddress();
  const key = `presentation-${verifierAddress}`;
  const presentation = window.localStorage.getItem(key);
  return presentation ?? '';
};
