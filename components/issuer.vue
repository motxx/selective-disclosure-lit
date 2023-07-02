<template>
  <section
    class="flex items-center justify-center flex-col h-full max-w-screen-xl mx-auto"
  >
    <div class="w-full px-4">
      <h1
        class="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 md:mb-8 tracking-tight"
      >
        Issuer
      </h1>
      <h2
        class="text-2xl md:text-3xl font-extrabold text-gray-800 mb-4 md:mb-8 tracking-tight"
      >
        Create Verifiable Credential
      </h2>
      <div class="w-full max-w-lg">
        <issuer-issue-form />
      </div>
      <div class="w-full max-w-lg">
        <issuer-revoke-form />
      </div>
    </div>
  </section>
</template>
