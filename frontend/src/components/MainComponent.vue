<template>
  <div class="bg-gray-900 text-white">
    <Navbar class="z-50 relative" /> <!-- Aquí se incluye el componente Navbar -->
    <Hero class="relative z-40" /> <!-- Aquí se incluye el componente Hero -->
    
    <div class="container mx-auto py-12">
      <section class="game-list-section mb-8">
        <h2 class="text-3xl font-bold mb-6 text-center">Featured Games</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div v-for="game in featuredGames" :key="game.id" class="game-card bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <img :src="game.imagen" :alt="game.nombre + ' Image'" class="game-image h-64 w-full object-cover" />
            <div class="p-4">
              <h3 class="text-xl font-bold mb-2">{{ game.nombre }}</h3>
              <p class="text-gray-400">{{ game.descripcion }}</p>
              <button @click="addToCart(game)" class="block w-full mt-4 py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">Add to Cart</button>
            </div>
          </div>
        </div>
      </section>

      <section class="game-list-section mb-8">
        <h2 class="text-3xl font-bold mb-6 text-center">New Releases</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div v-for="game in newGames" :key="game.id" class="game-card bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <img :src="game.imagen" :alt="game.nombre + ' Image'" class="game-image h-64 w-full object-cover" />
            <div class="p-4">
              <h3 class="text-xl font-bold mb-2">{{ game.nombre }}</h3>
              <p class="text-gray-400">{{ game.descripcion }}</p>
              <button @click="addToCart(game)" class="block w-full mt-4 py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">Add to Cart</button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <Footer /> <!-- Aquí se incluye el componente Footer -->
  </div>
</template>

<script>
import Navbar from './navbarComponent.vue';
import Footer from './FooterComponent.vue';
import Hero from './HeroComponent.vue';
import axios from '../main';

export default {
  components: {
    Navbar, 
    Footer,
    Hero
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
      this.featuredGames = this.games;
      this.newGames = this.games;

    },
    addToCart(game) {
      this.cart.push(game);
    },
    checkout() {
      if (this.cart.length > 0) {
        // Implement checkout logic here
        alert("Checkout completed!");
        this.cart = []; // Empty the cart after checkout
      }
    }
  }
};
</script>

<style>
/* Add your global styles here */
</style>
