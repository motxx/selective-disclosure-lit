<script setup lang="ts">
import { createRef } from './utilities';
import * as issuer from '~/usecase/issuer';

const revokeHolderAddress = createRef('');
const revokeCredentialName = createRef('');

const revokeCredential = async () => {
  if (revokeHolderAddress.value === '' || revokeCredentialName.value === '') {
    return;
  }
  await issuer.revokeCredential(
    revokeHolderAddress.value,
    revokeCredentialName.value,
  );
};
</script>
<template>
  <h2
    class="text-2xl md:text-3xl font-extrabold text-gray-800 mt-6 mb-4 md:mb-8 tracking-tight"
  >
    Revoke Credential
  </h2>
  <div class="grid grid-cols-1 gap-6">
    <div>
      <form-input
        label="Holder Address"
        placeholder="Enter holder address"
        v-model="revokeHolderAddress"
        id="grid-revoke-holder-address"
      />
    </div>
    <div>
      <form-input
        label="Credential Name"
        placeholder="Enter credential name"
        v-model="revokeCredentialName"
        id="grid-revoke-credential-name"
      />
    </div>
    <div>
      <button
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        @click="revokeCredential"
      >
        Revoke
      </button>
    </div>
  </div>
</template>
