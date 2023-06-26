// https://www.w3.org/TR/did-core/#architecture-overview

export const anchorDIDDocument = async (did: string, didDocument: any) => {
  const key = documentKey(did, 'didDocument');
  await uploadDocument(did, key, didDocument);
};
