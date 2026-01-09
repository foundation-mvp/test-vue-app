<template>
  <div class="app" :class="{ dark: foundation.isDark.value }">
    <header class="header">
      <h1>My Vue App</h1>
      <div class="header-right">
        <ThemeIndicator />
        <UserMenu />
      </div>
    </header>

    <main class="main">
      <div v-if="!foundation.isReady.value" class="loading">
        Connecting to platform...
      </div>

      <template v-else>
        <section class="section">
          <h2>Welcome, {{ foundation.currentUser?.name || foundation.currentUser?.email || 'User' }}</h2>
          <p class="muted">This Vue app uses the Foundation SDK for auth, data, and UI.</p>
          <pre class="user-data">{{ JSON.stringify(foundation.currentUser, null, 2) }}</pre>
        </section>

        <section class="section">
          <RouterDemo />
        </section>

        <section class="section">
          <BannerDemo />
        </section>

        <section class="section">
          <EntityEventsDemo />
        </section>

        <section class="section">
          <FilesDemo />
        </section>

        <section class="section">
          <TodoList />
        </section>

        <section class="section">
          <NotificationDemo />
        </section>
      </template>
    </main>
  </div>
</template>

<script setup>
import { useFoundation } from './composables/useFoundation'
import ThemeIndicator from './components/ThemeIndicator.vue'
import UserMenu from './components/UserMenu.vue'
import TodoList from './components/TodoList.vue'
import NotificationDemo from './components/NotificationDemo.vue'
import RouterDemo from './components/RouterDemo.vue'
import BannerDemo from './components/BannerDemo.vue'
import EntityEventsDemo from './components/EntityEventsDemo.vue'
import FilesDemo from './components/FilesDemo.vue'

const foundation = useFoundation()
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

.header h1 {
  font-size: 1.25rem;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.main {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
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
