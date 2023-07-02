export const createRef = (initialValue = '') => ref(initialValue);

export const createDID = (walletAddress: string) => {
  return `did:ethr:${walletAddress}`;
};
