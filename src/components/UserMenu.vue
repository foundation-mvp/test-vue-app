<template>
  <div class="user-menu">
    <img
      v-if="user?.picture"
      :src="user.picture"
      class="avatar"
      @error="(e) => e.target.style.display = 'none'"
    />
    <span class="name">{{ user?.email || 'User' }}</span>
    <button class="ghost" @click="handleLogout">Logout</button>
  </div>
</template>

<script setup>
import { useFoundation } from '../composables/useFoundation'

const { user, auth } = useFoundation()

async function handleLogout() {
  try {
    await auth.logout()
  } catch (e) {
    console.error('Logout failed:', e)
  }
}
</script>

<style scoped>
.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.name {
  font-size: 0.875rem;
  color: var(--text);
}
</style>
