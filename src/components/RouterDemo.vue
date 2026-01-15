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
      <button class="primary" @click="pushDemo">Push /demo</button>
      <button class="primary" @click="pushWithQuery">Push with Query</button>
      <button class="secondary" @click="replaceHome">Replace /home</button>
      <button class="secondary" @click="setQueryParams">Set Query</button>
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

async function pushDemo() {
  try {
    const id = Date.now().toString(36)
    await router.push(`/demo/${id}`)
    lastAction.value = `Pushed /demo/${id}`
  } catch (e) {
    lastAction.value = `Error: ${e.message}`
  }
}

async function pushWithQuery() {
  try {
    await router.push('/tasks', { query: { filter: 'active', page: '1' } })
    lastAction.value = 'Pushed /tasks with query'
  } catch (e) {
    lastAction.value = `Error: ${e.message}`
  }
}

async function replaceHome() {
  try {
    await router.replace('/home')
    lastAction.value = 'Replaced with /home (no history)'
  } catch (e) {
    lastAction.value = `Error: ${e.message}`
  }
}

async function setQueryParams() {
  try {
    await router.setQuery({ status: 'completed', sort: 'date' })
    lastAction.value = 'Set query params'
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
