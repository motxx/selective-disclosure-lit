export type EcdsaMultikeyKeyPair = {
  '@context': 'https://w3id.org/security/multikey/v1';
  type: 'Multikey';
  controller: string;
  id: string;
  publicKeyMultibase: string;
  secretKeyMultibase: string;
};
