<script setup lang="ts">
import * as verifier from '~/usecase/verifier';
const presentation = ref('');

const emit = defineEmits(['presentation-downloaded']);

const downloadPresentation = async () => {
  const serialized = await verifier.downloadPresentation();
  if (serialized) {
    const givenPresentation = JSON.parse(serialized);
    presentation.value = JSON.stringify(givenPresentation, null, 4);
    emit('presentation-downloaded', givenPresentation);
  } else {
    presentation.value = '';
    emit('presentation-downloaded', null);
  }
};
</script>

<template>
  <div class="flex flex-wrap -mx-3 mb-6 mt-auto">
    <div class="w-full px-3">
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        @click="downloadPresentation"
      >
        Download Presentation
      </button>
    </div>
  </div>
  <div class="flex flex-wrap -mx-3 mb-6" v-if="presentation">
    <div class="w-full px-3 mb-6 md:mb-0">
      <label
        class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        for="grid-presentation"
      >
        Given Presentation
      </label>
      <auto-height-textarea
        v-model="presentation"
        id="grid-presentation"
        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        readonly
      />
    </div>
  </div>
</template>
