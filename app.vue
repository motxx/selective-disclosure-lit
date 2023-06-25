<script setup lang="ts">
onMounted(async () => {
  window.global = window;
});

const walletAddress = ref('');

const connectWallet = async () => {
  if (window.ethereum) {
    walletAddress.value = '0x2f0C01465D38Fc4A31c95B7e74a4c80BE6d87bBe';
  } else {
    console.log('Metamask is not installed.');
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <app-header :connectWallet="connectWallet" :walletAddress="walletAddress" />
    <app-main />
  </div>
</template>

<style scoped>
body {
}

.btn-group {
  display: flex;
  gap: 0.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  border: none;
}

.btn:hover {
  filter: brightness(90%);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #3182ce;
  color: white;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 8px 0px;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 8px 0px;
}

.fa-plus,
.fa-minus {
  font-size: 1rem;
}

.fa-plus:before {
  content: '\f067';
}

.fa-minus:before {
  content: '\f068';
}
</style>
