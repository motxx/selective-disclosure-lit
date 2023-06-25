<script setup lang="ts">
import { Credential } from '~/components/interfaces/credential.interface';
import * as holder from '~/usecase/holder';

const props = defineProps<{
  credential: Credential;
}>();

const discloseOptions = ['Deny', 'Allow'];
const presentation = ref('');
const nameDisclosure = ref('Deny');
const genderDisclosure = ref('Deny');
const countryDisclosure = ref('Deny');

const verifierAddress = ref('0xc9dEECD767301257d7533bc816945F23dbEE7B5e');

const createPresentation = async () => {
  const res = await holder.createPresentation(verifierAddress.value, {
    credentialName: props.credential.credentialName,
    nameDisclosure: nameDisclosure.value === 'Allow',
    genderDisclosure: genderDisclosure.value === 'Allow',
    countryDisclosure: countryDisclosure.value === 'Allow',
  });
  if (res) {
    presentation.value = JSON.stringify(res, null, 4);
  }
};
</script>
<template>
  <h2
    class="text-2xl md:text-3xl font-extrabold text-gray-800 mb-4 md:mb-8 tracking-tight"
  >
    Create Verifiable Presentation
  </h2>

  <!-- VC ACL -->
  <div class="w-full max-w-lg flex flex-col">
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-verifierAddress"
        >
          Verifier Address
        </label>
        <input
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="grid-verifier-address"
          type="text"
          placeholder="Enter verifier address"
          v-model="verifierAddress"
        />
        <hr class="h-px my-8 bg-gray-200 border-0" />
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-username"
        >
          Name
        </label>
        <div class="flex">
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-username"
            type="text"
            v-model="credential.name"
            readonly
          />
          <div class="relative ml-2 w-40">
            <select
              v-model="nameDisclosure"
              class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-country"
            >
              <option
                v-for="option in discloseOptions"
                :value="option"
                :key="option"
              >
                {{ option }}
              </option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M17.293 6.293a1 1 0 00-1.414-1.414L10 12.586 6.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-gender"
        >
          Gender
        </label>
        <div class="flex">
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-username"
            type="text"
            v-model="credential.gender"
            readonly
          />
          <div class="relative ml-2 w-40">
            <select
              v-model="genderDisclosure"
              class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-country"
            >
              <option
                v-for="option in discloseOptions"
                :value="option"
                :key="option"
              >
                {{ option }}
              </option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M17.293 6.293a1 1 0 00-1.414-1.414L10 12.586 6.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-country"
        >
          Country
        </label>
        <div class="flex">
          <input
            class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="grid-username"
            type="text"
            v-model="credential.country"
            readonly
          />
          <div class="relative ml-2 w-40">
            <select
              v-model="countryDisclosure"
              class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="grid-country"
            >
              <option
                v-for="option in discloseOptions"
                :value="option"
                :key="option"
              >
                {{ option }}
              </option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <svg
                class="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M17.293 6.293a1 1 0 00-1.414-1.414L10 12.586 6.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l7-7z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VP Button -->
    <div class="flex flex-wrap -mx-3 mb-6 mt-auto">
      <div class="w-full px-3">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          :disabled="!verifierAddress"
          @click="createPresentation"
        >
          Create Presentation
        </button>
      </div>
    </div>

    <!-- Derived Proof -->
    <div class="flex flex-wrap -mx-3 mb-6" v-if="presentation">
      <div class="w-full px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-presentation"
        >
          Presentation (Derived Proof)
        </label>
        <auto-height-textarea
          v-model="presentation"
          id="grid-presentation"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          readonly
        />
      </div>
    </div>
  </div>
</template>
