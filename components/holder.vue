<script setup lang="ts">
import { Credential } from '~/components/interfaces/credential.interface';

const credential = ref(null as Credential | null);

const credentialFetched = (_credential: Credential) => {
  credential.value = _credential;
};
</script>

<template>
  <section
    class="flex items-center justify-center flex-col h-full max-w-screen-xl mx-auto"
  >
    <div class="w-full px-4">
      <h1
        class="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 md:mb-8 tracking-tight"
      >
        Holder
      </h1>
      <holder-fetch-vc @credential-fetched="credentialFetched" />
      <div v-if="credential">
        <holder-create-presentation :credential="credential" />
      </div>
    </div>
  </section>
</template>
