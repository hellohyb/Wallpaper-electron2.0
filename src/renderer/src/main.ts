import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@renderer/assets/tailwindcssMain.css'
import listenLocalStorage from '@renderer/utils/listenLocalStorage'
import VueLazyload from 'vue-lazyload'
import loadsvg from '@renderer/assets/loading.svg'
import { createPinia } from 'pinia'
import pinia from './stores/pinia'

createApp(App)
.use(createPinia())
.use(pinia)
.use(router)
.use(listenLocalStorage)
.use(VueLazyload, {
    loading: loadsvg, // 占位符图片
    attempt: 1
  })
.mount('#app')
