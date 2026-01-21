<template>
  <div class="app" :class="{ dark: foundation.isDark.value }">
    <header class="header">
      <div class="header-left">
        <h1>My Vue App</h1>
        <nav class="nav">
          <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">Home</router-link>
          <router-link to="/files" class="nav-link" :class="{ active: $route.path === '/files' }">Files</router-link>
          <router-link to="/todos" class="nav-link" :class="{ active: $route.path === '/todos' }">Todos</router-link>
          <router-link to="/websocket" class="nav-link" :class="{ active: $route.path === '/websocket' }">WebSocket</router-link>
        </nav>
      </div>
      <div class="header-right">
        <ThemeIndicator />
        <UserMenu />
      </div>
    </header>

    <main class="main">
      <div v-if="!foundation.isReady.value" class="loading">
        Connecting to platform...
      </div>

      <router-view v-else />
    </main>
  </div>
</template>

<script setup>
import { useFoundation } from 'foundation-sdk/vue'
import ThemeIndicator from './components/ThemeIndicator.vue'
import UserMenu from './components/UserMenu.vue'

const foundation = useFoundation()

// NOTE - INTENTED
// const vueRouter = useRouter()

// Sync SDK router changes to vue-router
// When parent container URL changes, SDK broadcasts ROUTER_CHANGED
// We need to sync that to vue-router so the correct view renders
// watch(
//   () => foundation.routerPath.value,
//   (newPath) => {
//     if (newPath && vueRouter.currentRoute.value.path !== newPath) {
//       vueRouter.replace({
//         path: newPath,
//         query: foundation.routerQuery.value,
//         hash: foundation.routerHash.value
//       })
//     }
//   }
// )
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
}

.app {
  --bg: #f8fafc;
  --bg-card: #ffffff;
  --text: #1e293b;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --success: #10b981;
  --danger: #ef4444;

  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}

.app.dark {
  --bg: #0f172a;
  --bg-card: #1e293b;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --border: #334155;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header h1 {
  font-size: 1.25rem;
  font-weight: 600;
}

.nav {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  text-decoration: none;
  color: var(--text-muted);
  transition: background 0.15s, color 0.15s;
}

.nav-link:hover {
  background: var(--border);
  color: var(--text);
}

.nav-link.active {
  background: var(--primary);
  color: white;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.main {
  flex: 1;
}

.section {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.section h2 {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

.muted {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
}

/* Shared button styles */
button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.15s;
}

button.primary {
  background: var(--primary);
  color: white;
}
button.primary:hover {
  background: var(--primary-hover);
}

button.secondary {
  background: var(--border);
  color: var(--text);
}

button.danger {
  background: var(--danger);
  color: white;
}

button.success {
  background: var(--success);
  color: white;
}

button.ghost {
  background: transparent;
  color: var(--text);
}
button.ghost:hover {
  background: var(--border);
}

.user-data {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.75rem;
  overflow-x: auto;
}
</style>
