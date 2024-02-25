<template>
  <div class="bg-gray-900 text-white">
    <Navbar />
    <Hero />
    <div class="container mx-auto py-12">
      <section class="game-list-section mb-8">
        <h2 class="text-3xl font-bold mb-6 text-center">Featured Games</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div v-for="game in featuredGames" :key="game._id"
            class="game-card bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col justify-between h-full">
            <div>
              <img :src="game.imagen" :alt="game.nombre + ' Image'" class="game-image h-64 w-full object-cover" />
              <div class="p-4">
                <h3 class="text-lg font-bold mb-2">{{ game.nombre }}</h3>
                <p class="text-gray-300 leading-relaxed">{{ game.descripcion }}</p>
                <div class="flex justify-between items-center mt-4">
                  <div class="text-gray-400 flex items-center">
                    <span class="mr-1 text-lg ">{{ game.precio }}</span>
                    <span class="text-xs text-gradient">SOL</span>
                  </div>
                  <p class="text-xs text-gray-400">{{ (game.precio * SOL_TO_USD_RATE).toFixed(2) }} USD</p>
                </div>
              </div>
            </div>
            <button type="submit" @click="switchToBuy(game._id)"
              class="block w-full py-2 px-4 bg-indigo-700 text-white font-bold rounded hover:bg-indigo-500 mt-auto">Comprar</button>
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
import { useRouter } from 'vue-router';

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
    };
  },
  async created() {
    await this.getJuegos();
  },
  methods: {
    async getJuegos() {
      const res = await axios.get('/juegos');
      this.games = res.data;
      // Limitar la cantidad de juegos mostrados a 12
      this.featuredGames = this.games.slice(0, 12);
      this.newGames = this.games;

    },
    checkout() {
      if (this.cart.length > 0) {
        // Implement checkout logic here
        alert("Checkout completed!");
        this.cart = []; // Empty the cart after checkout
      }
    },
    switchToBuy(gameid) {
      // Redirect the user to the registration page
      this.$router.push('/solanaPay?id=' + gameid);
    }
  }
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
