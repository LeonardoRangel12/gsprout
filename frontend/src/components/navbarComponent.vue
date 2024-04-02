<template>
  <section class="relative mx-auto">
    <!-- navbar -->
    <nav
      class="top-0 left-0 z-60 flex justify-between bg-gray-950 text-white w-full"
    >
      <div class="px-5 xl:px-12 py-6 flex w-full items-center">
        <a class="text-3xl font-bold font-heading" href="#">
          <router-link to="/main">
            <img
              class="h-12"
              src="https://i.imgur.com/QDzM74E.png"
              alt="logo"
            />
          </router-link>
        </a>
        <!-- Nav Links -->
        <ul
          v-if="!mobileMenuOpen"
          class="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12"
        >
          <li>
            <router-link class="hover:text-gray-200" to="/main"
              >Main</router-link
            >
          </li>
          <li>
            <router-link class="hover:text-gray-200" to="/Store"
              >Store</router-link
            >
          </li>
          <!--
          <li>
            <router-link class="hover:text-gray-200" to="/auctions"
              >Auctions</router-link
            >
          </li>
          -->
          <li>
            <router-link class="hover:text-gray-200" to="/mygames"
              >My games</router-link
            >
          </li>
          <li>
            <router-link class="hover:text-gray-200" to="/messenger"
                >Messages</router-link
            >
          </li>
          <li>
            <router-link class="hover:text-gray-200" to="/about"
              >About</router-link
            >
          </li>
        </ul>
        <!-- Mobile Nav Links -->
        <ul
          v-if="mobileMenuOpen"
          class="block md:hidden px-4 mx-auto font-semibold font-heading space-y-4 text-center"
        >
          <li>
            <router-link class="block py-2 border-b border-gray-700 hover:text-gray-200" to="/main"
              >Main</router-link
            >
          </li>
          <li>
            <router-link class="block py-2 border-b border-gray-700 hover:text-gray-200" to="/Store"
              >Store</router-link
            >
          </li>
          <!--
          <li>
            <router-link class="block py-2 border-b border-gray-700 hover:text-gray-200" to="/auctions"
              >Auctions</router-link
            >
          </li>
          -->
          <li>
            <router-link class="block py-2 border-b border-gray-700 hover:text-gray-200" to="/mygames"
              >My games</router-link
            >
          </li>
          <li>
            <router-link class="block py-2 border-b border-gray-700 hover:text-gray-200" to="/messenger"
                >Messages</router-link
            >
          </li>
          <li>
            <router-link class="block py-2 border-b border-gray-700 hover:text-gray-200" to="/about"
              >About</router-link
            >
          </li>
        </ul>
        <!-- Header Icons -->
        <div class="hidden xl:flex items-center space-x-5 items-center">
          <wallet-multi-button></wallet-multi-button>
          <router-link to="/WishList">
            <a class="hover:text-gray-200" href="#">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </a>
          </router-link>
          <a class="flex items-center hover:text-gray-200" href="#">
            <span class="flex absolute -mt-5 ml-4">
              <span
                class="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-pink-400 opacity-75"
              ></span>
              <span
                class="relative inline-flex rounded-full h-3 w-3 bg-pink-500"
              ></span>
            </span>
          </a>
          <!-- Sign In / Register -->
          <a
            @click="toggleProfileMenu"
            class="flex items-center hover:text-gray-200 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 hover:text-gray-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </a>
        </div>
      </div>
      <!-- Responsive navbar -->
      <a
        @click="mobileMenuOpen = !mobileMenuOpen"
        class="navbar-burger self-center mr-12 xl:hidden"
        href="#"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 hover:text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </a>
    </nav>
    <!-- Profile Menu -->
    <!-- Código del perfil del menú -->
  </section>
</template>

<script>
import { WalletMultiButton, useWallet } from "solana-wallets-vue";
import io from "socket.io-client";
import Swal from "sweetalert2";
export default {
  components: {
    WalletMultiButton,
  },
  name: "NavbarComponent",
  data() {
    return {
      showProfileMenu: false,
      connected: useWallet().connected,
      socket: null,
      usuario: "",
      mobileMenuOpen: false,
    };
  },

  watch: {
    connected: {
      handler: async function (val) {
        if (!val) {
          this.logout();
        }
      },
    },
  },
  mounted() {
    if(import.meta.env.PROD){
      console.log("PROD");
      this.socket = io("/");
    } else if (import.meta.env.DEV){
      console.log("DEV");
      this.socket = io("http://localhost:3000");
    }
    
    console.log("Socket", this.socket);

    if(!localStorage.getItem("token")){
      this.logout();
      return;
    }
    this.socket.emit("login", localStorage.getItem("token"));

    this.socket.on("login", (message) => {
      console.log("Login: " + message);
    });

    // Escucha los mensajes que recibe el usuario
    this.socket.on("message", (data) => {
      Swal.fire({
        title: "New message",
        text: "You have a new message from " + data.from + ": " + data.message,
        icon: "info",
        confirmButtonText: "OK",
      });
      // Evento personalizado para notificar a otro componente del mensaje recibido
      this.$emit("message", data);
      // this.messages[]
    });
  },
  methods: {
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu;
    },
    logout() {
      localStorage.removeItem("username");
      // JWT
      localStorage.removeItem("token");
      // Si la solicitud de logout fue exitosa, redirige al usuario a '/'
      this.$router.push("/");
    },
  },
  beforeUnmount() {
    this.socket.off("message");
    this.socket.off("login");
  },
};
</script>

<style scoped>
/* Aquí puedes agregar estilos específicos para este componente si es necesario */
</style>
