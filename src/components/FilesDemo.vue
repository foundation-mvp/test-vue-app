<template>
  <div class="files-demo">
    <h3>Files (Presigned Upload)</h3>
    <p class="description">Initiate uploads and get presigned URLs</p>

    <div class="file-picker">
      <input
        type="file"
        ref="fileInput"
        @change="handleFileSelect"
        :disabled="loading"
      />
    </div>

    <div v-if="selectedFile" class="selected-file-info">
      <h4>Selected File Metadata</h4>
      <div class="info-row">
        <span class="label">Name:</span>
        <code>{{ selectedFile.name }}</code>
        <span v-if="selectedFile.originalName !== selectedFile.name" class="name-note">(sanitized)</span>
      </div>
      <div class="info-row">
        <span class="label">Content Type:</span>
        <code>{{ selectedFile.contentType }}</code>
      </div>
      <div class="info-row">
        <span class="label">Content Length:</span>
        <code>{{ selectedFile.contentLength }} bytes</code>
      </div>
      <div class="info-row">
        <span class="label">SHA-256:</span>
        <code class="sha256">{{ selectedFile.sha256 || 'Computing...' }}</code>
      </div>
    </div>

    <div class="actions">
      <button class="primary" @click="listFiles">List Files</button>
      <button
        class="success"
        @click="initiateUpload"
        :disabled="!selectedFile || !selectedFile.sha256 || loading"
      >
        {{ loading ? 'Uploading...' : 'Upload Selected File' }}
      </button>
      <button
        v-if="selectedFile"
        class="secondary"
        @click="clearSelection"
      >
        Clear
      </button>
    </div>

    <div class="files-info">
      <div v-if="loading" class="empty">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="uploadResult" class="upload-result">
        <h4>Upload Initiated</h4>
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
      <div v-else class="empty">Select a file to upload or list existing files</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFoundation } from 'foundation-sdk/vue'

const { files: filesService } = useFoundation()
const loading = ref(false)
const error = ref(null)
const files = ref([])
const uploadResult = ref(null)
const selectedFile = ref(null)
const fileInput = ref(null)
const rawFile = ref(null)

async function computeSHA256(file) {
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
  const hashArray = new Uint8Array(hashBuffer)
  let binary = ''
  hashArray.forEach(byte => binary += String.fromCharCode(byte))
  // Standard Base64 (not URL-safe) - S3 expects this format for integrity checks
  const base64 = btoa(binary)
  console.log('SHA-256 length:', base64.length, 'value:', base64)
  return base64
}

function sanitizeFileName(name) {
  // Replace spaces and invalid characters with underscores
  // Allowed: a-zA-Z0-9!#$%&'*+.^_`|~-
  return name.replace(/[^a-zA-Z0-9!#$%&'*+.^_`|~\-]/g, '_')
}

async function handleFileSelect(event) {
  const file = event.target.files?.[0]
  if (!file) {
    selectedFile.value = null
    rawFile.value = null
    return
  }

  rawFile.value = file
  error.value = null
  uploadResult.value = null

  selectedFile.value = {
    name: sanitizeFileName(file.name),
    originalName: file.name,
    contentType: file.type || 'application/octet-stream',
    contentLength: file.size,
    sha256: null
  }

  try {
    const sha256 = await computeSHA256(file)
    selectedFile.value.sha256 = sha256
  } catch (e) {
    error.value = `Failed to compute SHA-256: ${e.message}`
  }
}

function clearSelection() {
  selectedFile.value = null
  rawFile.value = null
  uploadResult.value = null
  error.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function listFiles() {
  loading.value = true
  error.value = null
  uploadResult.value = null
  try {
    const result = await filesService.list({ limit: 10 })
    files.value = result?.items || []
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function initiateUpload() {
  if (!selectedFile.value || !selectedFile.value.sha256) {
    error.value = 'Please select a file first'
    return
  }

  loading.value = true
  error.value = null
  files.value = []

  const payload = {
    name: selectedFile.value.name,
    contentType: selectedFile.value.contentType,
    contentLength: selectedFile.value.contentLength,
    sha256: selectedFile.value.sha256
  }

  console.log('Initiating upload with payload:', payload)

  try {
    const result = await filesService.initiate(payload)
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

.file-picker {
  margin-bottom: 1rem;
}

.file-picker input[type="file"] {
  width: 100%;
  padding: 0.5rem;
  border: 2px dashed var(--border);
  border-radius: 6px;
  background: var(--bg);
  cursor: pointer;
}

.file-picker input[type="file"]:hover {
  border-color: var(--primary);
}

.selected-file-info {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 1rem;
}

.selected-file-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.sha256 {
  word-break: break-all;
  font-size: 0.65rem !important;
}

.name-note {
  font-size: 0.75rem;
  color: var(--warning, #f59e0b);
  margin-left: 0.5rem;
}

button.secondary {
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--border);
}

button.secondary:hover {
  background: var(--border);
}

.upload-result h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: var(--success);
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
