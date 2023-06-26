<script setup lang="ts">
import inputDocument from '~/lib/credentials/bbs-bls/data/inputDocument.json';
import * as issuer from '~/usecase/issuer';

const genders = ['Female', 'Male', 'Others'];
const countries = [
  'USA',
  'Canada',
  'Mexico',
  'Australia',
  'New Zealand',
  'United Kingdom',
  'France',
  'Germany',
  'Spain',
  'Italy',
  'Japan',
  'China',
  'India',
  'Brazil',
  'Argentina',
];

const createRef = (initialValue = '') => ref(initialValue);

const holderAddress = createRef('0xD32241f26f604E4dD2523b12aD21fD029EAF0F2D');
const credentialName = createRef('PermanentResidentCard');
const givenName = createRef('Sana');
const familyName = createRef('Natori');
const gender = createRef('Female');
const birthDate = createRef('2006-03-07');
const country = createRef('Japan');

const createDID = (walletAddress: string) => {
  return `did:ethr:${walletAddress}`;
};

const createCredentialSubject = () => ({
  credentialSubject: {
    id: createDID(holderAddress.value),
    type: ['PermanentResident', 'Person'],
    givenName: givenName.value,
    familyName: familyName.value,
    gender: gender.value,
    image: 'data:image/png;base64,iVBORw0KGgokJggg==',
    residentSince: '2015-01-01',
    lprCategory: 'C09',
    lprNumber: '999-999-999',
    commuterClassification: 'C1',
    birthCountry: country.value,
    birthDate: birthDate.value,
  },
});

const logFields = () => {
  console.log({
    'Holder Address': holderAddress.value,
    'Given Name': givenName.value,
    'Family Name': familyName.value,
    Gender: gender.value,
    'Birth Date': birthDate.value,
    Country: country.value,
  });
};

const isAnyFieldEmpty = () => {
  const fields = [
    holderAddress,
    givenName,
    familyName,
    gender,
    birthDate,
    country,
  ];
  return fields.some((field) => field.value === '');
};

const issueCredential = async () => {
  logFields();

  if (isAnyFieldEmpty()) {
    return;
  }
  await issuer.issueCredential(holderAddress.value, credentialName.value, {
    ...inputDocument,
    ...createCredentialSubject(),
  });
};
</script>
<template>
  <div class="w-full max-w-lg">
    <div class="grid grid-cols-1 gap-6">
      <div>
        <form-input
          label="Holder Address"
          placeholder="Enter holder address"
          v-model="holderAddress"
          id="grid-holder-address"
        />
      </div>
      <div>
        <form-input
          label="Credential Name"
          placeholder="Enter credential name"
          v-model="credentialName"
          id="grid-credential-name"
        />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <form-input
            label="Given Name"
            placeholder="Enter given name"
            v-model="givenName"
            id="grid-given-name"
          />
        </div>
        <div>
          <form-input
            label="Family Name"
            placeholder="Enter family name"
            v-model="familyName"
            id="grid-family-name"
          />
        </div>
      </div>
      <div>
        <form-input
          label="Birth Date"
          id="grid-birth-date"
          type="date"
          placeholder="Enter your birth date"
          v-model="birthDate"
        />
      </div>
      <div>
        <form-select
          id="grid-birth-country"
          label="Country"
          :options="countries"
          v-model="country"
          defaultOption=""
        />
      </div>
      <div>
        <form-select
          id="grid-birth-gender"
          label="Gender"
          :options="genders"
          v-model="gender"
          defaultOption=""
        />
      </div>
      <div>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="issueCredential"
        >
          Create
        </button>
      </div>
    </div>
  </div>
</template>
