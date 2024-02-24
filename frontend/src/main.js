import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import axios from 'axios'
import LoginComponentVue from './components/LoginComponent.vue'
import RegisterComponentVue from './components/RegisterComponent.vue'
import MainComponentVue from './components/MainComponent.vue'
import SolanaPayComponentVue from './components/SolanaPayComponent.vue'

axios.defaults.baseURL = 'http://localhost:3000/';
axios.defaults.headers['Content-Type'] = 'multipart/form-data'
axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers['HttpOnly'] = true
axios.defaults.withCredentials = true

const routes = [
  { path: '/main', component: MainComponentVue },
  { path: '/', component: LoginComponentVue },
  { path: '/register', component: RegisterComponentVue },
  { path: '/solanaPay', component: SolanaPayComponentVue }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

createApp(App).use(router).mount('#app')
 
export default axios