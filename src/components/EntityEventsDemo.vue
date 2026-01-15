<template>
  <div class="entity-events-demo">
    <h3>Entity Events (Real-time)</h3>
    <p class="description">Listen for WebSocket entity changes</p>

    <div class="actions">
      <button :class="listening ? 'danger' : 'primary'" @click="toggleListener">
        {{ listening ? 'Stop Listening' : 'Start Listening' }}
      </button>
      <button class="secondary" @click="clearEvents" :disabled="events.length === 0">Clear</button>
    </div>

    <div class="events-log">
      <div v-if="!listening && events.length === 0" class="empty">
        Listener inactive
      </div>
      <div v-else-if="listening && events.length === 0" class="empty">
        Listening for entity changes...
      </div>
      <div v-for="(event, i) in events" :key="i" class="event-entry">
        <span class="change-type">{{ event.changeType }}</span>
        <span class="entity">{{ event.entityId }}/{{ event.id }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useFoundation } from 'foundation-sdk/vue'

const { onEntityChange } = useFoundation()
const listening = ref(false)
const events = ref([])
let unsubscribe = null

function toggleListener() {
  if (listening.value) {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    listening.value = false
  } else {
    unsubscribe = onEntityChange((event) => {
      events.value.unshift(event)
      // Keep only last 10 events
      if (events.value.length > 10) {
        events.value.pop()
      }
    })
    listening.value = true
  }
}

function clearEvents() {
  events.value = []
}

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<style scoped>
.entity-events-demo h3 {
  margin-bottom: 0.25rem;
}

.description {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.events-log {
  background: var(--bg);
  border-radius: 6px;
  padding: 0.5rem;
  min-height: 60px;
  max-height: 120px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 0.75rem;
}

.empty {
  color: var(--text-muted);
  font-style: italic;
}

.event-entry {
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--border);
}

.event-entry:last-child {
  border-bottom: none;
}

.change-type {
  color: var(--success);
  margin-right: 0.5rem;
}

.entity {
  color: var(--text);
}
</style>
