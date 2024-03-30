<template>
  <div class="bg-gray-900 text-white">
    <Navbar />
    <div class="p-8 rounded-md w-full">
      <div class="flex items-center justify-between pb-6">
        <div>
          <h2 class="font-semibold">Auctions</h2>
          <span class="text-xs">All the games available</span>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="juego in juegos" :key="juego.id" class="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div class="w-full h-64 bg-gray-600">
            <img class="w-full h-full object-cover" :src="juego.imagen" :alt="juego.nombre" />
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold">{{ juego.nombre }}</h3>
            <p class="text-gray-300 text-justify">{{ truncar(juego.descripcion) }}</p>
            <div class="mt-4 flex justify-between items-center">
              <div>
                <p class="text-gray-300">{{ juego.precio }} SOL</p>
                <p class="text-gray-300">{{ (juego.precio * SOL_TO_USD_RATE).toFixed(2) }} USD</p>
              </div>
              <div>
                <p class="text-gray-300">{{ juego.vendedor || 'gsprout' }}</p>
                <p class="text-gray-300">{{ juego.remainingTime }}</p>
              </div>
              <div>
                <span v-if="juego.activo" class="px-3 py-1 font-semibold text-green-900 bg-green-200 rounded-full">Active</span>
                <span v-else class="px-3 py-1 font-semibold text-red-900 bg-red-200 rounded-full">Inactive</span>
              </div>
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
    this.setRandomRemainingTime();
  },
  methods: {
    async getJuegos() {
      try {
        const response = await axios.get('/juegos');
        this.juegos = response.data.map(juego => ({
          ...juego,
          vendedor: juego.vendedor || 'gsprout'
        }));
      } catch (error) {
        console.error('Error al obtener juegos:', error);
      }
    },
    setRandomRemainingTime() {
      this.juegos.forEach(juego => {
        const totalSeconds = Math.floor(Math.random() * ((10 * 60) - (5 * 60) + 1)) + (5 * 60);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        juego.remainingTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      });
    },
    truncar(text, maxLength = 240) {
      return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
    }
  }
};
</script>

<style scoped>
/* Estilos específicos para este componente van aquí */
</style>
