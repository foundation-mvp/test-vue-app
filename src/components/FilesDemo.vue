<template>
  <div class="files-demo">
    <h3>Files (Presigned Upload)</h3>
    <p class="description">Initiate uploads and get presigned URLs</p>

    <div class="actions">
      <button class="primary" @click="listFiles">List Files</button>
      <button class="success" @click="initiateUpload">Initiate Upload</button>
    </div>

    <div class="files-info">
      <div v-if="loading" class="empty">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="uploadResult" class="upload-result">
        <div class="info-row">
          <span class="label">File ID:</span>
          <code>{{ uploadResult.id || 'N/A' }}</code>
        </div>
        <div class="info-row">
          <span class="label">Signed URL:</span>
          <code>{{ uploadResult.signedUrl ? 'Received' : 'N/A' }}</code>
        </div>
      </div>
      <div v-else-if="files.length > 0" class="files-list">
        <div v-for="file in files" :key="file.id" class="file-row">
          <span class="file-name">{{ file.name }}</span>
          <code class="file-id">{{ file.id }}</code>
        </div>
      </div>
      <div v-else class="empty">No files</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSdk } from '../composables/useSdk'

const sdk = useSdk()
const loading = ref(false)
const error = ref(null)
const files = ref([])
const uploadResult = ref(null)

async function listFiles() {
  loading.value = true
  error.value = null
  uploadResult.value = null
  try {
    const result = await sdk.files.list({ limit: 10 })
    files.value = result?.items || []
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function initiateUpload() {
  loading.value = true
  error.value = null
  files.value = []
  try {
    const result = await sdk.files.initiate({
      name: 'test-file.txt',
      contentType: 'text/plain',
      contentLength: 1024
    })
    uploadResult.value = result
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.files-demo h3 {
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

.files-info {
  background: var(--bg);
  border-radius: 6px;
  padding: 0.75rem;
  min-height: 60px;
}

.empty {
  color: var(--text-muted);
  font-style: italic;
  font-size: 0.875rem;
}

.error {
  color: var(--danger);
  font-size: 0.875rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  font-size: 0.875rem;
}

.info-row .label {
  color: var(--text-muted);
}

.info-row code {
  font-family: monospace;
  font-size: 0.75rem;
}

.file-row {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.875rem;
}

.file-row:last-child {
  border-bottom: none;
}

.file-id {
  font-family: monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
}
</style>
