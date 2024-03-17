<template>
  <div class="bg-gray-900 text-white">
    <Navbar class="" style="z-index: 9999;" />
    <Hero />
    <div class="container mx-auto py-12">
      <section class="game-list-section mb-8">
        <h2 class="text-3xl font-bold mb-6 text-center">Juegos Destacados</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div v-for="juego in featuredGames" :key="juego._id" class="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <div class="w-full h-64 bg-gray-600">
              <img class="w-full h-full object-cover" :src="juego.imagen" :alt="juego.nombre" />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold">{{ juego.nombre }}</h3>
              <p class="text-gray-300">{{ juego.descripcion }}</p>
              <div class="mt-4 flex justify-between items-center">
                <div>
                  <p class="text-gray-300">{{ juego.precio }} SOL</p>
                  <p class="text-gray-300">{{ (juego.precio * SOL_TO_USD_RATE).toFixed(2) }} USD</p>
                </div>
                <button @click="switchToBuy(juego._id)" class="px-4 py-2 bg-indigo-700 text-white font-bold rounded hover:bg-indigo-500 transition duration-300 ease-in-out">
                  Comprar
                </button>
                <button v-if="!isFavorite" @click="addToWishList(juego._id)">Añadir a favoritos</button>
                <button v-else @click="removeFromWishList(juego._id)">Remover de favoritos</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <NewGames />
    <Footer />
  </div>
</template>

<script>
import Navbar from './navbarComponent.vue';
import Footer from './FooterComponent.vue';
import Hero from './HeroComponent.vue';
import NewGames from './NewGamesComponent.vue';
import axios from '../main';
import Swal from 'sweetalert2'; // Importa SweetAlert
import { inject } from 'vue';
export default {
  components: {
    Navbar,
    Footer,
    Hero,
    NewGames,
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
  setup() {

  },
  async created() {
    await this.getExchange();
    await this.getJuegos();
    await this.getWishList();

  },
  computed:{
    isFavorite(juegoId){
      return this.wishlist.includes(juegoId)
    }
  },
  methods: {
    async getExchange() {
      try {
        const res = await axios.get('/exchange');
        console.log(res);
        this.SOL_TO_USD_RATE = res.data.sell;
      } catch (error) {
        console.error(error);
      }
    },
    async addToWishList(juegoId){
      try {
        const res = await axios.post('/usuarios/wishlist/' + juegoId);
        alert('Juego añadido a favoritos');
      } catch (error) {
        console.error(error);
      }
    },
    async removeFromWishList(juegoId){
      try {
        const res = await axios.delete('/usuarios/wishlist/' + juegoId);
        alert('Juego removido de favoritos');
      } catch (error) {
        console.error(error);
      }
    },
    async getWishList() {
      inject('wishlist', (wishlist) => {
      this.wishlist = wishlist;
    })
    },
    async getJuegos() {
      try {
        const res = await axios.get('/juegos');
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
        const juego = this.games.find(game => game._id === gameid);
        if (!juego) {
          throw new Error('Juego no encontrado');
        }
        // Redirige al usuario a la página de Solana Pay con los parámetros necesarios
        this.$router.push(`/solanaPay?id=${juego._id}&price=${juego.precio}`);
      } catch (error) {
        console.error(error);
      }
    },
  },

  beforeUnmount() {
    this.$root.$off('wishlist');
  },
};
</script>

<style>
.text-gradient {
  background-image: linear-gradient(to right, #00FFA3, #03E1FF, #DC1FFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
