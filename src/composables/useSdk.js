import { ref, reactive, readonly } from 'vue'

// Shared state across all components
const state = reactive({
  ready: false,
  user: null,
  theme: { isDark: false, mode: 'system' },
  router: { path: '/', query: {}, hash: '' },
  config: null,
  entities: []
})

// Pending requests
let messageId = 0
const pending = new Map()

// Theme change listeners
const themeListeners = []

// Router change listeners
const routerListeners = []

// Entity event listeners
const entityListeners = []

/**
 * Send message to container and await response
 */
function send(namespace, type, data = {}) {
  return new Promise((resolve, reject) => {
    const id = ++messageId
    pending.set(id, { resolve, reject })

    window.parent.postMessage({
      id,
      namespace,
      type: `${namespace}.${type}`,
      data
    }, '*')

    setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id)
        reject(new Error('Request timeout'))
      }
    }, 30000)
  })
}

/**
 * Initialize SDK message listener (call once in App.vue)
 */
export function initSdk() {
  window.addEventListener('message', (event) => {
    const msg = event.data

    // SDK_READY
    if (msg?.type === 'SDK_READY') {
      state.ready = true
      state.user = msg.data?.user || null
      state.theme = msg.data?.theme || { isDark: false, mode: 'system' }
      state.router = msg.data?.router || { path: '/', query: {}, hash: '' }
      state.config = msg.data?.config || null
      state.entities = msg.data?.entities || []

      // Apply theme class
      document.body.classList.toggle('dark', state.theme.isDark)
      return
    }

    // THEME_CHANGED
    if (msg?.type === 'THEME_CHANGED') {
      state.theme = msg.data
      document.body.classList.toggle('dark', msg.data.isDark)
      themeListeners.forEach(fn => fn(msg.data))
      return
    }

    // ROUTER_CHANGED
    if (msg?.type === 'ROUTER_CHANGED') {
      state.router = msg.data
      routerListeners.forEach(fn => fn(msg.data))
      return
    }

    // ENTITY_CHANGED
    if (msg?.type === 'ENTITY_CHANGED') {
      entityListeners.forEach(fn => fn(msg.data))
      return
    }

    // Response to request
    if (typeof msg?.id === 'number' && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id)
      pending.delete(msg.id)
      msg.success ? resolve(msg.data) : reject(new Error(msg.error))
    }
  })
}

/**
 * Main SDK composable - use in any component
 */
export function useSdk() {
  return {
    // State (reactive, readonly)
    ready: readonly(ref(state.ready)),
    user: readonly(ref(state.user)),
    theme: readonly(ref(state.theme)),
    config: readonly(ref(state.config)),

    // Computed getters for reactive access
    get isReady() { return state.ready },
    get currentUser() { return state.user },
    get isDark() { return state.theme.isDark },
    get themeMode() { return state.theme.mode },

    // Auth
    auth: {
      get user() { return state.user },
      get isAuthenticated() { return !!state.user },
      getToken: () => send('auth', 'getToken'),
      logout: () => send('auth', 'logout'),
    },

    // UI
    ui: {
      toast: (message, type = 'info') => send('ui', 'toast', { message, toastType: type }),
      confirm: (message) => send('ui', 'confirm', { message }),
      loading: {
        show: (message) => send('ui', 'loading.show', { message }),
        hide: () => send('ui', 'loading.hide', {}),
      },
      banner: {
        show: (message, options = {}) => send('ui', 'banner.show', { message, ...options }),
        hide: (bannerId) => send('ui', 'banner.hide', { bannerId }),
      }
    },

    // Files
    files: {
      initiate: (file) => send('files', 'initiate', file),
      get: (fileId) => send('files', 'get', { fileId }),
      delete: (fileId) => send('files', 'delete', { fileId }),
      list: (options = {}) => send('files', 'list', options),
    },

    // Database
    db: {
      list: (entity, options = {}) => send('db', 'list', { entity, ...options }),
      get: (entity, id) => send('db', 'get', { entity, itemId: id }),
      create: (entity, item) => send('db', 'create', { entity, item }),
      update: (entity, id, updates) => send('db', 'update', { entity, itemId: id, updates }),
      delete: (entity, id) => send('db', 'delete', { entity, itemId: id }),
    },

    // Config
    config: {
      get features() { return state.config?.features || {} },
      get app() { return state.config?.app || {} },
      get: (key) => send('config', 'get', { key }),
    },

    // Logging
    log: {
      info: (message, data) => send('log', 'info', { message, data }),
      warn: (message, data) => send('log', 'warn', { message, data }),
      error: (message, data) => send('log', 'error', { message, data }),
      event: (name, properties) => send('log', 'event', { name, properties }),
    },

    // Router
    router: {
      get path() { return state.router.path },
      get query() { return state.router.query },
      get hash() { return state.router.hash },
      push: (path, options = {}) => send('router', 'push', { path, ...options }),
      replace: (path, options = {}) => send('router', 'replace', { path, ...options }),
      setQuery: (params, options = {}) => send('router', 'setQuery', { params, ...options }),
    },

    // Theme subscription
    onThemeChange(callback) {
      themeListeners.push(callback)
      return () => {
        const idx = themeListeners.indexOf(callback)
        if (idx > -1) themeListeners.splice(idx, 1)
      }
    },

    // Router subscription
    onRouterChange(callback) {
      routerListeners.push(callback)
      return () => {
        const idx = routerListeners.indexOf(callback)
        if (idx > -1) routerListeners.splice(idx, 1)
      }
    },

    // Entity event subscription
    onEntityChange(callback) {
      entityListeners.push(callback)
      return () => {
        const idx = entityListeners.indexOf(callback)
        if (idx > -1) entityListeners.splice(idx, 1)
      }
    }
  }
}
