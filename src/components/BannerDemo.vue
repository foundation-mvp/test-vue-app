<template>
  <div class="banner-demo">
    <h3>Banners</h3>
    <p class="description">Platform-rendered banners above the iframe</p>

    <div class="actions">
      <button class="primary" @click="showBanner('info')">Info</button>
      <button class="success" @click="showBanner('success')">Success</button>
      <button class="warning" @click="showBanner('warning')">Warning</button>
      <button class="danger" @click="showBanner('error')">Error</button>
    </div>

    <div v-if="lastBannerId" class="banner-info">
      <span class="label">Last Banner ID:</span>
      <code>{{ lastBannerId }}</code>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSdk } from '../composables/useSdk'

const sdk = useSdk()
const lastBannerId = ref(null)

const messages = {
  info: 'This is an informational banner',
  success: 'Operation completed successfully!',
  warning: 'Please review before continuing',
  error: 'Something went wrong!'
}

async function showBanner(type) {
  try {
    const result = await sdk.ui.banner.show(messages[type], { type, dismissible: true })
    lastBannerId.value = result?.bannerId
  } catch (e) {
    console.error('Banner error:', e)
  }
}
</script>

<style scoped>
.banner-demo h3 {
  margin-bottom: 0.25rem;
}

.description {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.warning {
  background: #f59e0b;
  color: white;
}

.banner-info {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.banner-info code {
  font-family: monospace;
  margin-left: 0.5rem;
}
</style>
