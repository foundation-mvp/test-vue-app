<template>
  <div class="page">
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
      <NotificationDemo />
    </section>
  </div>
</template>

<script setup>
import { useFoundation } from 'foundation-sdk/vue'
import NotificationDemo from '../components/NotificationDemo.vue'
import RouterDemo from '../components/RouterDemo.vue'
import BannerDemo from '../components/BannerDemo.vue'

const foundation = useFoundation()
</script>

<style scoped>
.page {
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
