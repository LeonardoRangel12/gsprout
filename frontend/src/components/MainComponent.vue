<template>
  <div class="bg-gray-900 text-white">
    <Navbar class="" style="z-index: 9999;" />
    <Hero />
    <div class="container mx-auto py-12">
      <section class="game-list-section mb-8">
        <h2 class="text-3xl font-bold mb-6 text-center">Juegos Destacados</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div v-for="juego in featuredGames" :key="juego._id" class="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative">
            <div class="w-full h-64 bg-gray-600">
              <img class="w-full h-full object-cover" :src="juego.imagen" :alt="juego.nombre" />
            </div>
            <button v-if="!wishlist.includes(juego._id)" @click="addToWishList(juego._id)" class="absolute top-2 right-2 text-red-500 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18.338l-.656-.623C4.203 13.23 1 10.12 1 6.5 1 3.463 3.462 1 6.5 1c1.61 0 3.086.73 4 1.88C10.414 1.729 11.89 1 13.5 1 16.538 1 19 3.463 19 6.5c0 3.621-3.203 6.73-8.344 11.215L10 18.339zM6.5 3C4.57 3 3 4.57 3 6.5c0 2.873 2.46 5.307 7 9.479 4.54-4.172 7-6.606 7-9.479C17 4.57 15.43 3 13.5 3c-1.407 0-2.454.63-3.169 1.654l-.331.479-.331-.48C8.954 3.63 7.907 3 6.5 3z" clip-rule="evenodd" />
              </svg>
            </button>
            <button v-else @click="removeFromWishList(juego._id)" class="absolute top-2 right-2 text-red-500 focus:outline-none">
              CHIHADOAHD
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18.338l-.656-.623C4.203 13.23 1 10.12 1 6.5 1 3.463 3.462 1 6.5 1c1.61 0 3.086.73 4 1.88C10.414 1.729 11.89 1 13.5 1 16.538 1 19 3.463 19 6.5c0 3.621-3.203 6.73-8.344 11.215L10 18.339zM6.5 3C4.57 3 3 4.57 3 6.5c0 2.873 2.46 5.307 7 9.479 4.54-4.172 7-6.606 7-9.479C17 4.57 15.43 3 13.5 3c-1.407 0-2.454.63-3.169 1.654l-.331.479-.331-.48C8.954 3.63 7.907 3 6.5 3z" clip-rule="evenodd" />
              </svg>
            </button>

            <div class="p-4">
              <h3 class="text-lg font-semibold">{{ juego.nombre }}</h3>
              <p class="text-gray-300">{{ juego.descripcion }}</p>
              <div class="mt-4 flex justify-between items-center">
                <div>
                  <p class="text-gray-300">{{ juego.precio }} SOL</p>
                  <p class="text-gray-300">{{ (juego.precio * SOL_TO_USD_RATE).toFixed(2) }} USD</p>
                </div>
                <button @click="switchToBuy(juego._id)" class="btn-primary">
                  Comprar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <NewGames />
    
    <Discord />
    <Footer />
  </div>
</template>

<script>

import Discord from './DiscordComponent.vue';

import Navbar from "./navbarComponent.vue";
import Footer from "./FooterComponent.vue";
import Hero from "./HeroComponent.vue";
import NewGames from "./NewGamesComponent.vue";
import axios from "../main";
import Swal from "sweetalert2"; // Importa SweetAlert
export default {
  components: {
    Navbar,
    Footer,
    Hero,
    NewGames,
    Discord,
  },
  data() {
    return {
      games: [],
      featuredGames: [],
      newGames: [],
      SOL_TO_USD_RATE: 50, // Adjust this value based on the current exchange rate
      wishlist: [],
    };
  },
  async created() {
    await this.getExchange();
    await this.getWishList();
    await this.getJuegos();

  },
  methods: {
    async getExchange() {
      console.log("ENTRA");
      try {
        const res = await axios.get("/exchange");
        console.log(res);
        this.SOL_TO_USD_RATE = res.data.sell;
      } catch (error) {
        console.error(error);
      }
    },
    async getWishList() {
      console.log("ENTRA");
      const res = await axios.get("/usuarios/me");
      console.log(res);
      // Si la solicitud es exitosa, envia la lista de deseos con un evento
      if (res.status == 200) {
        // this.wishlist = res.data.wishList;
        this.wishlist = res.data.wishList;
      } else if (res.status == 401) {
        this.logout();
      } else if (res.status == 404) {
        alert("Usuario no encontrado");
      }
    },
    async addToWishList(juegoId) {
      try {
        const res = await axios.post("/usuarios/wishlist/" + juegoId);
        if(res.status == 200){
          this.wishlist.push(juegoId);
          alert("Juego añadido a favoritos");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async removeFromWishList(juegoId) {
      try {
        const res = await axios.delete("/usuarios/wishlist/" + juegoId);
        if(res.status == 200){
          alert("Juego removido de favoritos");
          this.wishlist = this.wishlist.filter((id) => id !== juegoId);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async isFavorite(juegoId) {
      return this.wishlist.includes(juegoId);
    },

    async getJuegos() {
      try {
        const res = await axios.get("/juegos");
        this.games = res.data;
        // Limitar la cantidad de juegos mostrados a 12
        this.featuredGames = this.games.slice(0, 12);
        this.newGames = this.games;
      } catch (error) {
        console.error(error);
      }
    },
    async switchToBuy(gameid) {
      try {
        const juego = this.games.find((game) => game._id === gameid);
        if (!juego) {
          throw new Error("Juego no encontrado");
        }
        // Redirige al usuario a la página de Solana Pay con los parámetros necesarios
        this.$router.push(`/solanaPay?id=${juego._id}&price=${juego.precio}`);
      } catch (error) {
        console.error(error);
      }
    },
  },

  beforeUnmount() {
  },
};
</script>

<style>
.text-gradient {
  background-image: linear-gradient(to right, #00ffa3, #03e1ff, #dc1fff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>