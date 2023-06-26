import type { WithContext } from 'schema-dts';

// create the unsigned credential
export const unsignedCredential: WithContext<any> = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    {
      '@protected': true,
      DriverLicenseCredential: 'urn:example:DriverLicenseCredential',
      DriverLicense: {
        '@id': 'urn:example:DriverLicense',
        '@context': {
          '@protected': true,
          id: '@id',
          type: '@type',
          documentIdentifier: 'urn:example:documentIdentifier',
          dateOfBirth: 'urn:example:dateOfBirth',
          expirationDate: 'urn:example:expiration',
          issuingAuthority: 'urn:example:issuingAuthority',
        },
      },
      driverLicense: {
        '@id': 'urn:example:driverLicense',
        '@type': '@id',
      },
    },
    'https://w3id.org/security/data-integrity/v1',
  ],
  type: ['VerifiableCredential', 'DriverLicenseCredential'],
  issuer: 'did:key:zDnaekGZTbQBerwcehBSXLqAg6s55hVEBms1zFy89VHXtJSa9',
  issuanceDate: '2010-01-01T19:23:24Z',
  credentialSubject: {
    driverLicense: {
      type: 'DriverLicense',
      documentIdentifier: 'T21387yc328c7y32h23f23',
      dateOfBirth: '01-01-1990',
      expirationDate: '01-01-2030',
      issuingAuthority: 'VA',
    },
  },
};
