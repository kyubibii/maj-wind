import './assets/styles.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { usePlayStore } from '@/stores/playStore'

import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 加载状态
const playStore = usePlayStore()
playStore.loadState()

app.mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope)
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
  })
}
