<template>
  <div class="bg-gray-900 text-white">
    <Navbar class="" style="z-index: 9999;" />
    <Hero />
    <div class="container mx-auto py-12">
      <section class="game-list-section mb-8">
        <h2 class="text-3xl font-bold mb-6 text-center">Juegos Destacados</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <div v-for="game in featuredGames" :key="game._id"
            class="game-card bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col justify-between h-full">
            <div>
              <img :src="game.imagen" :alt="game.nombre + ' Image'" class="game-image h-64 w-full object-cover" />
              <div class="p-4">
                <h3 class="text-lg font-bold mb-2">{{ game.nombre }}</h3>
                <p class="text-gray-300 leading-relaxed">{{ game.descripcion }}</p>

              </div>
            </div>
            <button type="submit" @click="switchToBuy(game._id)"
              class="block w-full py-2 px-4 bg-indigo-700 text-white font-bold rounded hover:bg-indigo-500 mt-auto transition duration-300 ease-in-out">
              <div class="flex justify-between items-center">
                <div class="text-gray-400">
                  <span class="text-lg uppercase tracking-wide">Comprar</span>
                </div>

                <div class="text-gray-400 flex items-center">
                  <span class="mr-1 text-lg">{{ game.precio }}</span>
                  <span class="text-lg text-gradient">SOL</span>
                </div>

                <p class="text-lg text-gray-400">
                  {{ (game.precio * SOL_TO_USD_RATE).toFixed(2) }} USD
                </p>
              </div>
            </button>
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
import Swal from 'sweetalert2'; // Importa SweetAlert

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
    await this.getExchange();
    await this.getJuegos();
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
        Swal.fire({
          title: 'Checkout',
          text: '¿Estás seguro de que quieres proceder con el pago?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No',
        }).then((result) => {
          if (result.isConfirmed) {
            // Aquí iría la lógica de pago
            Swal.fire('¡Pago completado!', '', 'success');
            this.cart = []; // Vaciar el carrito después del pago
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Tu carrito está vacío',
        });
      }
    },
    switchToBuy(gameid) {
      // Redirige al usuario a la página de registro
      this.$router.push('/solanaPay?id=' + gameid + '&&price=' + this.games.find(game => game._id === gameid).precio);
    },
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
