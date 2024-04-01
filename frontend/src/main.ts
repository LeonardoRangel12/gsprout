import { createApp, ref } from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import "./style.css";
import App from "./App.vue";
import axios, { AxiosInstance } from "axios";
import LoginComponentVue from "./components/LoginComponent.vue";
import RegisterComponentVue from "./components/RegisterComponent.vue";
import MainComponentVue from "./components/MainComponent.vue";
import SolanaPayComponentVue from "./components/SolanaPayComponent.vue";
import UserProfileComponentVue from "./components/UserProfileComponent.vue";
import Auctions from "./components/AuctionsComponent.vue";
import StoreComponentVue from "./components/StoreComponent.vue";
import GameViewComponentVue from "./components/GameViewComponent.vue";
import WishList from "./components/WishListComponent.vue";
import NewGameComponentVue from "./components/NewGamesComponent.vue";
import AssetsComponentVue from "./components/AssetsComponent.vue";
import GameDetailsComponentVue from "./components/GameDetailsComponent.vue";
import DiscordComponentVue from "./components/DiscordComponent.vue";
import Messenger from "./components/MessengerComponent.vue";
import About from "./components/AboutComponent.vue";

import "vue-connect-wallet/dist/style.css"
let baseURL: string = "";
if (import.meta.env.DEV) baseURL = "http://localhost:3000/";
if (import.meta.env.PROD === "production") baseURL = "/backend/";

const token: string | null = localStorage.getItem("token");

const newAxios: AxiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `${token}`,
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});

const routes: RouteRecordRaw[] = [
  { path: "/", component: LoginComponentVue },
  { path: "/register", component: RegisterComponentVue },
  { path: "/main", component: MainComponentVue },
  { path: "/solanaPay", component: SolanaPayComponentVue },
  { path: "/profile", component: UserProfileComponentVue },
  { path: "/auctions", component: Auctions },
  { path: "/store", component: StoreComponentVue },
  { path: "/gameView", component: GameViewComponentVue },
  { path: "/wishlist", component: WishList },
  { path: "/newgame", component: NewGameComponentVue },
  { path: "/mygames", component: AssetsComponentVue },
  { path: "/mygames/:publicKey", component: AssetViewVue},
  { path: "/game/:gameId", component: GameDetailsComponentVue },
  { path: "/discord", component: DiscordComponentVue },
  { path: "/messenger", component: Messenger },
  { path: "/about", component: About },

  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

import SolanaWallets, { initWallet } from "solana-wallets-vue";

// You can either import the default styles or create your own.
import "solana-wallets-vue/styles.css";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import {
  PhantomWalletAdapter,
  CoinbaseWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  MathWalletAdapter,
  TrustWalletAdapter,

} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import AssetViewVue from "./components/AssetView.vue";

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new CoinbaseWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    new MathWalletAdapter(),
    new TrustWalletAdapter(),
    new LedgerWalletAdapter(),

  ],
  autoConnect: true,
};
initWallet(walletOptions);
// const rpc = import.meta.env.VITE_RPC;
const connection = new Connection(clusterApiUrl("devnet"));


// Websocket
// import io from "socket.io-client";
// const socket = io("http://localhost:3000");



const app = createApp(App);
// @ts-ignore

// app.use({
//   install(app) {
//     app.config.globalProperties.$socket = socket;
//   },
// });

app.use(SolanaWallets, walletOptions);
app.use(router);



export default newAxios;
export { connection};
app.mount("#app");
// 