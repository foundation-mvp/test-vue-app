<template>
  <div class="user-menu">
    <img
      v-if="sdk.currentUser?.picture"
      :src="sdk.currentUser.picture"
      class="avatar"
      @error="(e) => e.target.style.display = 'none'"
    />
    <span class="name">{{ sdk.currentUser?.email || 'User' }}</span>
    <button class="ghost" @click="handleLogout">Logout</button>
  </div>
</template>

<script setup>
import { useSdk } from '../composables/useSdk'

const sdk = useSdk()

async function handleLogout() {
  try {
    await sdk.auth.logout()
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
