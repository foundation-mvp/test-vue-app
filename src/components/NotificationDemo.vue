<template>
  <div class="notification-demo">
    <h3>Platform UI</h3>
    <p class="description">
      Use the SDK to show toasts, confirmations, and loading states.
    </p>

    <div class="demo-row">
      <span class="label">Toasts:</span>
      <div class="buttons">
        <button class="success" @click="showToast('success')">Success</button>
        <button class="primary" @click="showToast('info')">Info</button>
        <button style="background: #f59e0b" @click="showToast('warn')">Warn</button>
        <button class="danger" @click="showToast('error')">Error</button>
      </div>
    </div>

    <div class="demo-row">
      <span class="label">Dialogs:</span>
      <div class="buttons">
        <button class="secondary" @click="showConfirm">Confirm Dialog</button>
        <button class="secondary" @click="showLoading">Loading (2s)</button>
      </div>
    </div>

    <div v-if="lastResult" class="result">
      Last result: <code>{{ lastResult }}</code>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSdk } from '../composables/useSdk'

const sdk = useSdk()
const lastResult = ref(null)

async function showToast(type) {
  const messages = {
    success: 'Operation completed successfully!',
    info: 'Here is some information.',
    warn: 'Please be careful!',
    error: 'Something went wrong!'
  }

  await sdk.ui.toast(messages[type], type)
  lastResult.value = `Toast shown: ${type}`
}

async function showConfirm() {
  const result = await sdk.ui.confirm('Are you sure you want to proceed?')
  lastResult.value = `Confirmed: ${result?.confirmed ? 'Yes' : 'No'}`
}

async function showLoading() {
  await sdk.ui.loading.show('Processing your request...')
  lastResult.value = 'Loading shown'

  setTimeout(async () => {
    await sdk.ui.loading.hide()
    lastResult.value = 'Loading hidden'
  }, 2000)
}
</script>

<style scoped>
.notification-demo {
  margin-top: 1rem;
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.description {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.demo-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.label {
  width: 80px;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.result {
  margin-top: 1rem;
  padding: 0.75rem;
  background: var(--bg);
  border-radius: 6px;
  font-size: 0.875rem;
}

.result code {
  background: var(--border);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: monospace;
}
</style>
