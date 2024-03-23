import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@renderer/assets/tailwindcssMain.css'
import listenLocalStorage from '@renderer/utils/listenLocalStorage'
createApp(App)
.use(router)
.use(listenLocalStorage)
.mount('#app')
