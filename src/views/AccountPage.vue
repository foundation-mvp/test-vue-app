<template>
  <div class="page">
    <!-- Account Section -->
    <section class="section">
      <h2>Account</h2>
      <p class="muted">Read and update your account via <code>core.account</code></p>

      <div class="demo-row">
        <button class="primary" @click="fetchAccount" :disabled="loading.account">
          {{ loading.account ? 'Loading...' : 'Get Account' }}
        </button>
        <button class="secondary" @click="fetchUsage" :disabled="loading.usage">
          {{ loading.usage ? 'Loading...' : 'Get Usage' }}
        </button>
        <button class="secondary" @click="resendVerification" :disabled="loading.resend">
          {{ loading.resend ? 'Sending...' : 'Resend Verification' }}
        </button>
      </div>

      <!-- Update form -->
      <div v-if="accountData" class="update-form">
        <h3>Update Profile</h3>
        <div class="form-row">
          <label>First Name</label>
          <input v-model="editForm.firstName" placeholder="First name" />
        </div>
        <div class="form-row">
          <label>Last Name</label>
          <input v-model="editForm.lastName" placeholder="Last name" />
        </div>
        <button class="primary" @click="updateAccount" :disabled="loading.update">
          {{ loading.update ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>

      <pre v-if="accountData" class="data-block">{{ JSON.stringify(accountData, null, 2) }}</pre>
      <pre v-if="usageData" class="data-block">{{ JSON.stringify(usageData, null, 2) }}</pre>
      <div v-if="lastResult" class="result">{{ lastResult }}</div>
      <div v-if="error" class="result error-text">{{ error }}</div>
    </section>

    <!-- Integrations Section -->
    <section class="section">
      <h2>Integrations</h2>
      <p class="muted">Manage third-party integrations via <code>core.integration</code></p>

      <div class="demo-row">
        <button class="primary" @click="listIntegrations" :disabled="loading.intList">
          {{ loading.intList ? 'Loading...' : 'List Integrations' }}
        </button>
      </div>

      <div v-if="integrations" class="integration-list">
        <div v-for="item in integrations" :key="item.id" class="integration-card">
          <div class="integration-header">
            <strong>{{ item.title || item.id }}</strong>
            <span class="badge" :class="statusMap[item.id]?.connected ? 'badge-success' : 'badge-muted'">
              {{ statusMap[item.id]?.connected ? 'Connected' : 'Not connected' }}
            </span>
          </div>
          <div class="integration-actions">
            <button v-if="!statusMap[item.id]?.connected" class="success" @click="connectIntegration(item.id)">Connect</button>
            <template v-else>
              <button
                v-for="conn in statusMap[item.id].connections"
                :key="conn.id"
                class="danger"
                @click="disconnectIntegration(item.id, conn.id, conn.label)"
              >
                Disconnect{{ conn.label ? ` (${conn.label})` : '' }}
              </button>
            </template>
          </div>
        </div>
      </div>

      <pre v-if="integrationDetail" class="data-block">{{ JSON.stringify(integrationDetail, null, 2) }}</pre>
      <div v-if="intError" class="result error-text">{{ intError }}</div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useFoundation } from 'foundation-sdk/vue'

const { account, integration, ui } = useFoundation()

const loading = reactive({
  account: false,
  usage: false,
  resend: false,
  update: false,
  intList: false,
})

const accountData = ref(null)
const usageData = ref(null)
const lastResult = ref(null)
const error = ref(null)
const editForm = reactive({ firstName: '', lastName: '' })

const integrations = ref(null)
const statusMap = ref({})
const integrationDetail = ref(null)
const intError = ref(null)

// --- Account ---

async function fetchAccount() {
  loading.account = true
  error.value = null
  try {
    const data = await account.get()
    accountData.value = data
    if (data?.user) {
      editForm.firstName = data.user.firstName || ''
      editForm.lastName = data.user.lastName || ''
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.account = false
  }
}

async function updateAccount() {
  loading.update = true
  error.value = null
  try {
    await account.update({
      firstName: editForm.firstName,
      lastName: editForm.lastName,
    })
    ui.toast('Account updated', 'success')
    lastResult.value = 'Account updated successfully'
    await fetchAccount()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.update = false
  }
}

async function fetchUsage() {
  loading.usage = true
  error.value = null
  try {
    usageData.value = await account.usage()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.usage = false
  }
}

async function resendVerification() {
  loading.resend = true
  error.value = null
  try {
    await account.resendVerification()
    lastResult.value = 'Verification email sent'
    ui.toast('Verification email sent', 'success')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.resend = false
  }
}

// --- Integrations ---

async function listIntegrations() {
  loading.intList = true
  intError.value = null
  try {
    integrations.value = await integration.list()
    await refreshStatuses()
  } catch (e) {
    intError.value = e.message
  } finally {
    loading.intList = false
  }
}

async function refreshStatuses() {
  if (!integrations.value) return
  const map = {}
  for (const item of integrations.value) {
    try {
      map[item.id] = await integration.status(item.id)
    } catch {
      map[item.id] = { connected: false, connections: [] }
    }
  }
  statusMap.value = map
}

async function connectIntegration(source) {
  intError.value = null
  try {
    const result = await integration.connect(source)
    integrationDetail.value = result
    if (result?.success) {
      ui.toast(`Connected to ${source}`, 'success')
      await refreshStatuses()
    }
  } catch (e) {
    intError.value = e.message
  }
}

async function disconnectIntegration(source, configurationId, label) {
  intError.value = null
  try {
    const name = label || source
    const confirmed = await ui.confirm(`Disconnect ${name}?`)
    if (!confirmed?.confirmed) return
    await integration.disconnect(source, configurationId)
    ui.toast(`${name} disconnected`, 'success')
    await refreshStatuses()
  } catch (e) {
    intError.value = e.message
  }
}
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
  margin-bottom: 0.25rem;
}

.muted {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.muted code {
  background: var(--border);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.8125rem;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.data-block {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.75rem;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}

.result {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: var(--bg);
  border-radius: 6px;
  font-size: 0.875rem;
}

.error-text {
  color: var(--danger);
}

/* Update form */
.update-form {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 6px;
}

.update-form h3 {
  font-size: 0.9375rem;
  margin-bottom: 0.75rem;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.form-row label {
  width: 90px;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.form-row input {
  flex: 1;
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font-size: 0.875rem;
}

/* Integration cards */
.integration-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.integration-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 6px;
}

.integration-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.integration-actions {
  display: flex;
  gap: 0.5rem;
}

.badge {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 99px;
}

.badge-success {
  background: #dcfce7;
  color: #166534;
}

.badge-muted {
  background: var(--border);
  color: var(--text-muted);
}
</style>
