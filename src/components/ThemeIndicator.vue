<template>
  <div class="theme-indicator">
    <span class="icon">{{ isDark ? '🌙' : '☀️' }}</span>
    <span class="label">{{ themeMode }}</span>
  </div>
</template>

<script setup>
import { useFoundation } from '../composables/useFoundation'

const { isDark, themeMode } = useFoundation()
</script>

<style scoped>
.theme-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.icon {
  font-size: 1.125rem;
}

.label {
  text-transform: capitalize;
}
</style>
