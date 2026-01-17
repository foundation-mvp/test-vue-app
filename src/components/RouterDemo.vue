<template>
  <div class="router-demo">
    <h3>Router (Deep Linking)</h3>
    <p class="description">Navigate and update URL from within the iframe</p>

    <div class="current-route">
      <div class="route-item">
        <span class="label">Path:</span>
        <code>{{ routerPath }}</code>
      </div>
      <div class="route-item">
        <span class="label">Query:</span>
        <code>{{ JSON.stringify(routerQuery) }}</code>
      </div>
      <div class="route-item">
        <span class="label">Hash:</span>
        <code>{{ routerHash || '(none)' }}</code>
      </div>
    </div>

    <div class="actions">
      <button class="primary" @click="pushFiles">Push /files</button>
      <button class="primary" @click="pushTodosWithQuery">Push /todos with Query</button>
      <button class="secondary" @click="pushWebSocket">Push /websocket</button>
      <button class="secondary" @click="replaceHome">Replace /</button>
    </div>

    <div v-if="lastAction" class="last-action">
      {{ lastAction }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useFoundation } from 'foundation-sdk/vue'

const { router, routerPath, routerQuery, routerHash } = useFoundation()
const lastAction = ref('')

let unsubscribe = null

onMounted(() => {
  unsubscribe = router.onChange((route) => {
    lastAction.value = `Route changed to: ${route.path}`
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

async function pushFiles() {
  try {
    await router.push('/files')
    lastAction.value = 'Pushed /files'
  } catch (e) {
    lastAction.value = `Error: ${e.message}`
  }
}

async function pushTodosWithQuery() {
  try {
    await router.push('/todos', { query: { filter: 'active', page: '1' } })
    lastAction.value = 'Pushed /todos with query'
  } catch (e) {
    lastAction.value = `Error: ${e.message}`
  }
}

async function pushWebSocket() {
  try {
    await router.push('/websocket')
    lastAction.value = 'Pushed /websocket'
  } catch (e) {
    lastAction.value = `Error: ${e.message}`
  }
}

async function replaceHome() {
  try {
    await router.replace('/')
    lastAction.value = 'Replaced with / (no history)'
  } catch (e) {
    lastAction.value = `Error: ${e.message}`
  }
}
</script>

<style scoped>
.router-demo h3 {
  margin-bottom: 0.25rem;
}

.description {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.current-route {
  background: var(--bg);
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 1rem;
}

.route-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  font-size: 0.875rem;
}

.route-item .label {
  color: var(--text-muted);
}

.route-item code {
  font-family: monospace;
  font-size: 0.8rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.last-action {
  margin-top: 0.75rem;
  padding: 0.5rem;
  background: var(--bg);
  border-radius: 4px;
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
