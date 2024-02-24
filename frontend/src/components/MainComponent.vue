<template>
  <div class="dark:bg-gray-900">
    <Navbar class="z-50 relative" /> <!-- Aquí se incluye el componente Navbar -->
    <Hero class="relative z-40" /> <!-- Aquí se incluye el componente Hero -->
    
    <div class="container mx-auto py-12">
      <section class="game-list-section mb-8">
        <h2 class="text-2xl font-bold mb-4">Featured Games</h2>
        <div class="grid grid-cols-3 gap-8">
          <div v-for="game in featuredGames" :key="game.id" class="game-card">
            <div class="game-card-content p-4 border border-gray-700 rounded-lg">
              <img :src="game.imagen" :alt="game.nombre + ' Image'" class="game-image mb-2" />
              <h3 class="text-lg font-bold">{{ game.nombre }}</h3>
              <p class="text-gray-400 text-sm">{{ game.descripcion }}</p>
              <button @click="addToCart(game)" class="add-to-cart-btn mt-4">Add to Cart</button>
            </div>
          </div>
        </div>
      </section>

      <section class="game-list-section mb-8">
        <h2 class="text-2xl font-bold mb-4">New Releases</h2>
        <div class="grid grid-cols-3 gap-8">
          <div v-for="game in newGames" :key="game.id" class="game-card">
            <div class="game-card-content p-4 border border-gray-700 rounded-lg">
              <img :src="game.imagen" :alt="game.nombre + ' Image'" class="game-image-small mb-2" />
              <h3 class="text-lg font-bold">{{ game.nombre }}</h3>
              <p class="text-gray-400 text-sm">{{ game.descripcion }}</p>
              <button @click="addToCart(game)" class="add-to-cart-btn mt-4">Add to Cart</button>
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
