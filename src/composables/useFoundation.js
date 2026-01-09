/**
 * Vue composable wrapper for Foundation SDK
 *
 * Provides Vue reactivity around the framework-agnostic SDK client.
 */
import { ref, readonly, shallowRef } from 'vue'
import { createFoundationClient } from 'foundation-iframe-sdk'

// Singleton client
const client = createFoundationClient()

// Reactive state
const isReady = ref(false)
const user = shallowRef(null)
const isDark = ref(false)
const themeMode = ref('system')
const routerPath = ref('/')
const routerQuery = shallowRef({})
const routerHash = ref('')
const entities = shallowRef([])

// Initialize reactive state when SDK is ready
client.ready.then(() => {
  isReady.value = true
  user.value = client.auth.user
  isDark.value = client.theme.isDark
  themeMode.value = client.theme.mode
  routerPath.value = client.router.path
  routerQuery.value = client.router.query
  routerHash.value = client.router.hash
  entities.value = client.entities
})

// Subscribe to changes
client.auth.onChange((newUser) => {
  console.log("Auth change detected:", newUser);
  user.value = newUser
})

client.theme.onChange((theme) => {
  isDark.value = theme.isDark
  themeMode.value = theme.mode
})

client.router.onChange((route) => {
  routerPath.value = route.path
  routerQuery.value = route.query
  routerHash.value = route.hash
})

/**
 * Main composable for accessing Foundation SDK
 */
export function useFoundation() {
  return {
    // Reactive state (readonly to prevent external mutation)
    isReady: readonly(isReady),
    user: readonly(user),
    isDark: readonly(isDark),
    themeMode: readonly(themeMode),
    routerPath: readonly(routerPath),
    routerQuery: readonly(routerQuery),
    routerHash: readonly(routerHash),
    entities: readonly(entities),

    // Computed helpers
    get isAuthenticated() {
      return !!user.value
    },

    get currentUser() {
      return user.value
    },

    // Direct access to SDK client for non-reactive operations
    client,

    // Shorthand service access
    auth: client.auth,
    ui: client.ui,
    db: client.db,
    router: client.router,
    config: client.config,
    files: client.files,
    storage: client.storage,
    log: client.log,

    // Entity change subscription
    onEntityChange: client.onEntityChange
  }
}
