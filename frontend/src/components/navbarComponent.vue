<template>
  <section class="relative mx-auto">
    <!-- navbar -->
    <nav
      class="top-0 left-0 z-60 flex justify-between bg-gray-900 text-white w-full"
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
          class="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12"
        >
          <li>
            <router-link class="hover:text-gray-200" to="/main"
              >Inicio</router-link
            >
          </li>
          <li>
            <router-link class="hover:text-gray-200" to="/Store"
              >Tienda</router-link
            >
          </li>
          <li>
            <router-link class="hover:text-gray-200" to="/auctions"
              >Subastas</router-link
            >
          </li>
          <li>
            <router-link class="hover:text-gray-200" to="/mygames"
              >Mis Juegos</router-link
            >
          </li>
          <li>
            <router-link class="hover:text-gray-200" to="/messenger"
              >mensajes</router-link
            >
          </li>
          <li>
            <input
              v-model="usuario"
              type="text"
              placeholder="Usuario"
              class="rounded-md"
            />
            <button @click="sendMessage('Hello', usuario)">Send Message</button>
          </li>
        </ul>
        <!-- Header Icons -->

        <div class="hidden xl:flex items-center space-x-5 items-center">
          <wallet-multi-button></wallet-multi-button>
          <router-link to="/mygames">
            <a class="hover:text-gray-200" href="#"> Publicar </a>
          </router-link>
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
      <a class="navbar-burger self-center mr-12 xl:hidden" href="#">
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
    <div
      v-if="showProfileMenu"
      @click.away="showProfileMenu = false"
      class="absolute right-0 mt-0 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-gray-900 shadow-lg ring-1 ring-black/5 focus:outline-none"
    >
      <div class="px-1 py-1">
        <router-link
          to="/profile"
          class="group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fill-rule="evenodd"
              d="M20 10a10 10 0 11-20 0 10 10 0 0120 0zm-2 0a8 8 0 11-16 0 8 8 0 0116 0zM8 8a1 1 0 00-1-1H5a3 3 0 00-3 3v6a3 3 0 003 3h2a1 1 0 100-2H5a1 1 0 01-1-1v-6a1 1 0 011-1h2a1 1 0 100-2H8zm4-1h-2a1 1 0 000 2h2a1 1 0 100-2zm4 1a1 1 0 011-1h2a3 3 0 013 3v6a1 1 0 01-1 1h-2a1 1 0 100 2h2a3 3 0 003-3v-6a3 3 0 00-3-3h-2a1 1 0 01-1-1zm-4 11a1 1 0 100 2 1 1 0 000-2z"
              clip-rule="evenodd"
            />
          </svg>
          Perfil
        </router-link>
        <button
          @click="logout"
          class="group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="mr-2 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 5.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { WalletMultiButton, useWallet } from "solana-wallets-vue";
import io from "socket.io-client";
import axios from "../main";
import { computed, provide } from "vue";
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
      messages: {
        nanimon383: [],
      },
      usuario: "",
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
    this.socket = io("http://localhost:3000");

    this.socket.emit("login", localStorage.getItem("token"));

    this.socket.on("login", (message) => {
      console.log("Login: " + message);
    });

    // Escucha los mensajes que recibe el usuario
    this.socket.on("message", (data) => {
      console.log(data);
      alert(
        "From: " + data.from + " Message: " + data.message + " To: " + data.to
      );
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

    sendMessage(message) {
      const token = localStorage.getItem("token");
      const data = {
        message: message,
        from: token,
        to: this.usuario,
      };
      this.socket.emit("message", data);
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
