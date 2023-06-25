<script setup lang="ts">
const presentation = ref(null as any);

const presentationDownloaded = (_presentation: any) => {
  presentation.value = _presentation;
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
        Verifier
      </h1>
      <verifier-presentation-loader
        @presentation-downloaded="presentationDownloaded"
      />
      <div v-if="presentation">
        <verifier-verify-presentation :presentation="presentation" />
      </div>
    </div>
  </section>
</template>
