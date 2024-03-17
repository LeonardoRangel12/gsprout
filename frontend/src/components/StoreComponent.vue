<template>
  <div class="bg-gray-900 text-white">
    <Navbar />
    <div class="p-8 rounded-md w-full">
      <div class="flex items-center justify-between pb-6">
        <div>
          <h2 class="font-semibold">Tienda</h2>
          <span class="text-xs">Todos los juegos disponibles</span>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="juego in juegos" :key="juego.id" class="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <img class="w-full h-56 object-cover object-center" :src="juego.imagen" :alt="juego.nombre" />
          <div class="p-4">
            <h3 class="text-lg font-semibold">{{ juego.nombre }}</h3>
            <p class="text-gray-300 mb-4">{{ juego.descripcion }}</p>
            <div class="flex justify-between items-center">
              <div>
                <p class="text-gray-300 mb-2">{{ juego.precio }} SOL</p>
                <p class="text-gray-300">{{ (juego.precio * SOL_TO_USD_RATE).toFixed(2) }} USD</p>
              </div>
              <button @click="switchToBuy(juego._id)" class="px-3 py-1 bg-indigo-700 text-white font-semibold rounded hover:bg-indigo-500">Comprar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from './navbarComponent.vue';
import Footer from './FooterComponent.vue';
import axios from '../main';

export default {
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      juegos: [],
      SOL_TO_USD_RATE: 50 // Ajusta este valor según el tipo de cambio actual
    };
  },
  async created() {
    await this.getJuegos();
    await this.getExchange();
  },
  methods: {
    async getJuegos() {
      try {
        const response = await axios.get('/juegos');
        this.juegos = response.data.map(juego => ({
          ...juego,
          vendedor: juego.vendedor || 'gsprout',
          precioUSD: (juego.precio * this.SOL_TO_USD_RATE).toFixed(2) // Convertir precio a USD
        }));
      } catch (error) {
        console.error('Error al obtener juegos:', error);
      }
    },
    async getExchange() {
      try {
        const res = await axios.get('/exchange');
        this.SOL_TO_USD_RATE = res.data.sell;
      } catch (error) {
        console.error('Error al obtener el tipo de cambio:', error);
      }
    },
    switchToBuy(gameid) {
      // Redirect the user to the registration page
      this.$router.push('/solanaPay?id=' + gameid + '&&price=' + this.juegos.find(juego => juego._id === gameid).precio);
    },
  }
};
</script>

<style scoped>
/* Estilos específicos para este componente van aquí */
</style>
