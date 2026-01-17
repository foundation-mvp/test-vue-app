<template>
  <div class="entity-events-demo">
    <h3>WebSocket Messages (Real-time)</h3>
    <p class="description">Listen for all WebSocket messages from container</p>

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
        Listening for all messages...
      </div>
      <div v-for="(event, i) in events" :key="i" class="event-entry">
        <span class="message-type">{{ event.type }}</span>
        <pre class="message-data">{{ JSON.stringify(event.data, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const listening = ref(false)
const events = ref([])
let messageHandler = null

function handleMessage(event) {
  const message = event.data

  // Only process messages that look like they're from our container
  if (!message || typeof message !== 'object' || !message.type) {
    return
  }

  // Log all messages to console
  console.log('[WebSocket Message]', message.type, message.data || message)

  // Add to events list
  events.value.unshift({
    type: message.type,
    data: message.data,
    timestamp: new Date().toISOString()
  })

  // Keep only last 20 events
  if (events.value.length > 20) {
    events.value.pop()
  }
}

function toggleListener() {
  if (listening.value) {
    if (messageHandler) {
      window.removeEventListener('message', messageHandler)
      messageHandler = null
    }
    listening.value = false
  } else {
    messageHandler = handleMessage
    window.addEventListener('message', messageHandler)
    listening.value = true
    console.log('[WebSocket Listener] Started listening for all messages')
  }
}

function clearEvents() {
  events.value = []
}

onUnmounted(() => {
  if (messageHandler) {
    window.removeEventListener('message', messageHandler)
  }
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
  max-height: 300px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 0.75rem;
}

.empty {
  color: var(--text-muted);
  font-style: italic;
}

.event-entry {
  padding: 0.5rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 0.5rem;
}

.event-entry:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.message-type {
  color: var(--primary);
  font-weight: bold;
  display: block;
  margin-bottom: 0.25rem;
}

.message-data {
  color: var(--text);
  background: var(--bg-card);
  padding: 0.5rem;
  border-radius: 4px;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 0.7rem;
  max-height: 100px;
  overflow-y: auto;
}
</style>
