import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from 'axios'

axios.defaults.headers['Content-Type'] = 'application/form-data'
axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers['HttpOnly'] = true
axios.defaults.withCredentials = true

createApp(App).mount('#app')
export default axios