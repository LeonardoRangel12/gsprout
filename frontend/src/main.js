// main.js
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import './style.css';
import App from './App.vue';
import axios from 'axios';
import LoginComponentVue from './components/LoginComponent.vue';
import RegisterComponentVue from './components/RegisterComponent.vue';
import MainComponentVue from './components/MainComponent.vue';
import SolanaPayComponentVue from './components/SolanaPayComponent.vue';
import UserProfileComponentVue from './components/UserProfileComponent.vue';
import Auctions from './components/AuctionsComponent.vue';
import StoreComponentVue from './components/StoreComponent.vue';
import GameViewComponentVue from './components/GameViewComponent.vue';
import WishList from './components/WishListComponent.vue';
import NewGameComponentVue from './components/NewGamesComponent.vue';

let baseURL = '';
if(process.env.NODE_ENV === 'development')
  baseURL = 'http://localhost:3000/';
if(process.env.NODE_ENV === 'production')
  baseURL = '/backend/';

const token = localStorage.getItem('token');

const newAxios = axios.create({
  baseURL: baseURL,
  "Content-Type": 'multipart/form-data',
  "Access-Control-Allow-Origin": '*',
  "withCredentials": true,
  headers:{
    "Authorization": `${token}`
  },
})
// axios.defaults.headers['Content-Type'] = 'multipart/form-data';
// axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers['HttpOnly'] = true;
// axios.defaults.withCredentials = true;

const routes = [
  { path: '/', component: LoginComponentVue },
  { path: '/register', component: RegisterComponentVue },
  { path: '/main', component: MainComponentVue },
  { path: '/solanaPay', component: SolanaPayComponentVue },
  { path: '/profile', component: UserProfileComponentVue },
  { path: '/auctions', component: Auctions },
  { path: '/store', component: StoreComponentVue },
  { path: '/gameView', component: GameViewComponentVue },
  { path: '/wishlist', component: WishList },
  { path: '/newgame', component: NewGameComponentVue }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

createApp(App).use(router).mount('#app');

export default newAxios;