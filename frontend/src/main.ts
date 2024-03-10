import { createApp } from "vue";
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

// import {ConnectWalletButton} from "vue-connect-wallet";

let baseURL: string = "";
if (process.env.NODE_ENV === "development") baseURL = "http://localhost:3000/";
if (process.env.NODE_ENV === "production") baseURL = "/backend/";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

import SolanaWallets, { initWallet } from "solana-wallets-vue";
import "../node_modules/solana-wallets-vue/styles.css";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  CloverWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    new CloverWalletAdapter(),
    new CoinbaseWalletAdapter(),
    
  ],
  autoConnect: true,
};
initWallet(walletOptions);
//@ts-ignore
createApp(App).use(router,SolanaWallets, walletOptions).mount("#app");

export default newAxios;
