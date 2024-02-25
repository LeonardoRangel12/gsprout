<template>
  <div class="bg-gray-900 text-white">
    <Navbar class="z-50 relative" />
    <Hero class="relative z-40" />
    
    <div class="container mx-auto py-12">
      <section class="game-list-section mb-8">
        <h2 class="text-3xl font-bold mb-6 text-center">Featured Games</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div v-for="game in featuredGames" :key="game._id" class="game-card bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <img :src="game.imagen" :alt="game.nombre + ' Image'" class="game-image h-64 w-full object-cover" />
            <div class="p-4">
              <h3 class="text-xl font-bold mb-2">{{ game.nombre }}</h3>
              <p class="text-gray-400">{{ game.descripcion }}</p>
              <button type="submit" @click="switchToBuy(game._id)" class="block w-full mt-4 py-2 px-4 bg-indigo-700 text-white font-bold rounded hover:bg-indigo-500">Comprar</button>
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
    };
  },
  async created(){
    await this.getJuegos();
  },
  methods: {
    async getJuegos(){
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
/* Add your global styles here */
</style>
