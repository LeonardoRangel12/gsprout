<script>
import Navbar from './navbarComponent.vue';
import Footer from './FooterComponent.vue';

export default {
  components: {
    Navbar, // Registra el componente Navbar
    Footer // Registra el componente Footer
  },
  data() {
    return {
      games: [
        { id: 1, title: "Game 1", description: "Description of Game 1", image: "game1.jpg", imageSmall: "game1-small.jpg", price: 19.99 },
        { id: 2, title: "Game 2", description: "Description of Game 2", image: "game2.jpg", imageSmall: "game2-small.jpg", price: 29.99 },
        { id: 3, title: "Game 3", description: "Description of Game 3", image: "game3.jpg", imageSmall: "game3-small.jpg", price: 24.99 },
        { id: 4, title: "Game 4", description: "Description of Game 4", image: "game4.jpg", imageSmall: "game4-small.jpg", price: 34.99 },
        { id: 5, title: "Game 5", description: "Description of Game 5", image: "game5.jpg", imageSmall: "game5-small.jpg", price: 39.99 },
        { id: 6, title: "Game 6", description: "Description of Game 6", image: "game6.jpg", imageSmall: "game6-small.jpg", price: 29.99 },
        // Add more games here
      ],
      cart: []
    };
  },
  computed: {
    featuredGames() {
      return this.games.slice(0, 6);
    },
    newReleases() {
      return this.games.slice(6, 12);
    }
  },
  methods: {
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
<template>
  <div class="dark:bg-gray-900">
    <Navbar /> <!-- Aquí se incluye el componente Navbar -->
    <div class="hero bg-gray-800 text-white py-20 px-4 text-center">
      <h1 class="text-4xl font-bold mb-4">Welcome to the GSprout Store</h1>
      <p class="text-lg">Explore a world of gaming with our vast collection!</p>
    </div>

    <div class="container mx-auto py-12">
      <section class="game-list-section mb-8">
        <h2 class="text-2xl font-bold mb-4">Featured Games</h2>
        <div class="grid grid-cols-3 gap-8">
          <div v-for="game in featuredGames" :key="game.id" class="game-card">
            <div class="game-card-content p-4 border border-gray-700 rounded-lg">
              <img :src="game.image" :alt="game.title + ' Image'" class="game-image mb-2" />
              <h3 class="text-lg font-bold">{{ game.title }}</h3>
              <p class="text-gray-400 text-sm">{{ game.description }}</p>
              <button @click="addToCart(game)" class="add-to-cart-btn mt-4">Add to Cart</button>
            </div>
          </div>
        </div>
      </section>

      <section class="game-list-section mb-8">
        <h2 class="text-2xl font-bold mb-4">New Releases</h2>
        <div class="grid grid-cols-3 gap-8">
          <div v-for="game in newReleases" :key="game.id" class="game-card">
            <div class="game-card-content p-4 border border-gray-700 rounded-lg">
              <img :src="game.imageSmall" :alt="game.title + ' Image'" class="game-image-small mb-2" />
              <h3 class="text-lg font-bold">{{ game.title }}</h3>
              <p class="text-gray-400 text-sm">{{ game.description }}</p>
              <button @click="addToCart(game)" class="add-to-cart-btn mt-4">Add to Cart</button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <Footer /> <!-- Aquí se incluye el componente Footer -->
  </div>
</template>



<style>
/* Add your global styles here */
</style>
