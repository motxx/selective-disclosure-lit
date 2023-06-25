<script setup lang="ts">
import * as verifier from '~/usecase/verifier';

const props = defineProps<{
  presentation: any;
}>();

const verifiedData = ref(null as any);

const verifyPresentation = async () => {
  const res = await verifier
    .verifyPresentation(props.presentation)
    .catch((err) => {
      console.error(err);
      return false;
    });
  verifiedData.value = res;
};
</script>

<template>
  <div class="w-full max-w-lg flex flex-col">
    <!-- Verify Button -->
    <div class="flex flex-wrap -mx-3 mb-6 mt-auto">
      <div class="w-full px-3">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="verifyPresentation"
        >
          Verify Presentation
        </button>
      </div>
    </div>

    <!-- Verified Presentation -->
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3 mb-6 md:mb-0">
        <label
          class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          for="grid-presentation"
        >
          Verified Presentation
        </label>
        <auto-height-textarea
          v-model="verifiedData"
          id="grid-presentation"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          readonly
        />
      </div>
    </div>
  </div>
</template>
