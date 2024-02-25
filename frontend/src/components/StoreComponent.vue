<template>
    <div class="bg-gray-900 text-white">
      <Navbar class="z-50 relative" /> <!-- Aquí se incluye el componente Navbar -->
      
    <form class="max-w-md mx-auto">   
        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="relative">
            <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="search" id="default-search" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Buscar" required />
            <button type="submit" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Buscar</button>
        </div>
    </form>

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
  