<template>
  <div class="bg-gradient-to-b from-gray-950 to-gray-900 text-white">
    <Navbar class="" style="z-index: 9999" />
    <Hero />
    <div class="container mx-auto py-12">
      <section class="game-list-section mb-8">
        <h2 class="text-3xl font-bold mb-6 text-center">Featured Games</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" >
          <div v-for="juego in featuredGames" :key="juego._id" class="bg-gradient-to-b from-gray-950 to-gray-800 rounded-lg overflow-hidden shadow-lg relative cursor-pointer"  @click="switchToDetails(juego._id)">
            <div class="w-full aspect-w-16 aspect-h-9">
              <img
                class="w-full h-full object-cover"
                :src="juego.imagen"
                :alt="juego.nombre"
              />
            </div>
            <button
              v-if="wishlist == null || !wishlist.includes(juego._id)"
              @click="addToWishList(juego._id)"
              class="absolute top-2 right-2 text-gray-500 focus:outline-none"
            >
              <svg
                @click.stop="addToWishList(juego._id)"
                class="h-6 w-6 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>
            <button
              v-else
              @click="removeFromWishList(juego._id)"
              class="absolute top-2 right-2 text-red-500 focus:outline-none"
            >
              <svg
                @click.stop="removeFromWishList(juego._id)"
                class="h-6 w-6 fill-current text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                />
              </svg>
            </button>

            <div class="p-4">
              <div style="height: 140px;"> <!-- le da una altura fija para que el texto este parejo alv -->
                <h3 class="text-lg font-semibold">{{ juego.nombre }}</h3>
                <div div class="flex flex-nowrap mb-1">
                  <p class="text-gray-300">{{ juego.categoria.join(", ") + "." }}</p>
                </div>
              </div>
              <div class="mt-4 flex justify-between items-center">
                <div >
                  <p class="text-gray-300">{{ (juego.precio).toFixed(2) }} USD / {{ (juego.precio / SOL_TO_USD_RATE).toFixed(9) }} SOL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <NewGames :games="games" :SOL_TO_USD_RATE="SOL_TO_USD_RATE" />
    <Discord />
    <Footer />
  </div>
</template>


<script>
import Discord from "./DiscordComponent.vue";
import Navbar from "./navbarComponent.vue";
import Footer from "./FooterComponent.vue";
import Hero from "./HeroComponent.vue";
import NewGames from "./NewGamesComponent.vue";
import axios from "../main";
import Swal from "sweetalert2";
import { inject, ref } from "vue";
import { getExchange, getUsuario, getJuegos, getUserSession } from "../apis";

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
      SOL_TO_USD_RATE: 50, // Adjust this value based on the current exchange rate
      wishlist: [],
    };
  },
  async setup() {
    const games = ref([]);
    const exchange = ref(50);
    const wishlist = ref([]);
    const requests = [getExchange(), getUsuario(), getJuegos()];
    const hasSession = getUserSession();
    await Promise.all(requests)
      .then((values) => {
        games.value = values[2];
        exchange.value = values[0];
        wishlist.value = values[1] == null ? [] : values[1].wishlist;
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "An error occurred while loading the page. Please try again.",
        });
      });
    const featuredGames = ref(games.value.slice(0, 12));
    return { games, featuredGames, hasSession, SOL_TO_USD_RATE: exchange, wishlist};
  },
  async mounted() {
    const games = inject("games");
  },
  methods: {
    async addToWishList(juegoId) {
      try {
        if(this.hasSession){
          const res = await axios.post("/usuarios/wishlist/" + juegoId);
          if (res.status == 200) {
            this.wishlist.push(juegoId);
            Swal.fire({
              icon: "success",
              title: "Success!",
              text: "Game added to favorites",
            });
          }
        }
        else{
          Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: "Necesitas iniciar sesión para añadir juegos a favoritos",
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    async removeFromWishList(juegoId) {
      try {
      if(this.hasSession){
        const res = await axios.delete("/usuarios/wishlist/" + juegoId);
        if (res.status == 200) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Game removed from favorites",
          });
          this.wishlist = this.wishlist.filter((id) => id !== juegoId);
        }
      }
    } catch (error) {
        console.error(error);
      }
    },
    async isFavorite(juegoId) {
      return this.wishlist != null ? this.wishlist.includes(juegoId) : false;
    },
    async switchToBuy(gameid) {
      try {
        if(this.hasSession){
          const juego = this.games.find((game) => game._id === gameid);
          if (!juego) {
            throw new Error("Game not found");
          }
          this.$router.push(`/solanaPay?id=${juego._id}&price=${juego.precio}`);
        }
        else{
          this.$router.push("/?needinfo='login'");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async switchToDetails(gameid) {
      try {
        const juego = this.games.find((game) => game._id === gameid);
        if (!juego) {
          throw new Error("Game not found");
        }
        this.$router.push(`/gameView?id=${juego._id}&price=${juego.precio}`);
      } catch (error) {
        console.error(error);
      }
    },
  },
  filters: {
    truncate(value, maxLength) {
      if (!value) return "";
      if (value.length <= maxLength) return value;
      return value.substr(0, maxLength) + "...";
    },
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
