import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router/router.js'
import './style/styles.scss'
import './icons.js'
import './service/axios.js'

// create and mount Vue application
const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')


