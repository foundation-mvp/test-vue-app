<template>
  <div class="page">
    <section class="section">
      <FilesDemo />
    </section>
  </div>
</template>

<script setup>
import FilesDemo from '../components/FilesDemo.vue'
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
}
</style>
