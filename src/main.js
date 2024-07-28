import { createApp } from 'vue'

import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'

import store from './store/store'
import router from './router'
import './assets/main.css'

const app = createApp(App)

store.dispatch('authorization/initializeAuth').then(() => {
  app.use(router)
  app.use(autoAnimatePlugin)
  app.use(store)
  app.mount('#app')
})
