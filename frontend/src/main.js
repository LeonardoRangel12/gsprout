import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import router from './router'

axios.defaults.headers['Content-Type'] = 'multipart/form-data'
axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers['HttpOnly'] = true
axios.defaults.withCredentials = true

createApp(App).use(router).mount('#app')

createApp(App).mount('#app')
export default axios