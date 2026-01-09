<template>
  <div class="theme-indicator">
    <button
      class="theme-toggle"
      @click="toggleTheme"
      :title="`Current: ${themeMode} - Click to toggle`"
    >
      <span class="icon">{{ isDark ? '🌙' : '☀️' }}</span>
      <span class="label">{{ themeMode }}</span>
    </button>
    <div class="theme-buttons">
      <button
        v-for="mode in themeModes"
        :key="mode"
        class="theme-btn"
        :class="{ active: themeMode === mode }"
        @click="setTheme(mode)"
      >
        {{ mode }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useFoundation } from '../composables/useFoundation'

const { isDark, themeMode, setTheme, toggleTheme } = useFoundation()

const themeModes = ['light', 'system', 'dark']
</script>

<style scoped>
.theme-indicator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  color: var(--text);
  transition: all 0.15s;
}

.theme-toggle:hover {
  background: var(--border);
}

.icon {
  font-size: 1rem;
}

.label {
  text-transform: capitalize;
  font-size: 0.75rem;
}

.theme-buttons {
  display: flex;
  gap: 0.25rem;
  background: var(--border);
  border-radius: 6px;
  padding: 0.125rem;
}

.theme-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.625rem;
  text-transform: uppercase;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.theme-btn:hover {
  color: var(--text);
}

.theme-btn.active {
  background: var(--bg-card);
  color: var(--text);
  font-weight: 500;
}
</style>
