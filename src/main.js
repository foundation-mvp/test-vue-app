import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initFoundation } from 'foundation-sdk/vue'

// Initialize Foundation SDK with vue-router for direct navigation
initFoundation({ router })

createApp(App).use(router).mount('#app')
