<template>
  <div class="bg-gray-900 text-white">
    <Navbar />
    <div class="p-8 rounded-md w-full">
      <div class="flex items-center justify-between pb-6">
        <div>
          <h2 class="font-semibold">Juegos en Subasta</h2>
          <span class="text-xs">Todos los juegos disponibles</span>
        </div>
      </div>
      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table class="min-w-full leading-normal">
            <thead>
              <tr>
                <th class="px-5 py-3 border-b-2 border-gray-800 bg-gray-800 text-left text-xs font-semibold uppercase tracking-wider">
                  Nombre
                </th>
                <th class="px-5 py-3 border-b-2 border-gray-800 bg-gray-800 text-left text-xs font-semibold uppercase tracking-wider">
                  Descripción
                </th>
                <th class="px-5 py-3 border-b-2 border-gray-800 bg-gray-800 text-left text-xs font-semibold uppercase tracking-wider">
                  Precio
                </th>
                <th class="px-5 py-3 border-b-2 border-gray-800 bg-gray-800 text-left text-xs font-semibold uppercase tracking-wider">
                  Vendedor
                </th>
                <th class="px-5 py-3 border-b-2 border-gray-800 bg-gray-800 text-left text-xs font-semibold uppercase tracking-wider">
                  Tiempo Restante
                </th>
                <th class="px-5 py-3 border-b-2 border-gray-800 bg-gray-800 text-left text-xs font-semibold uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="juego in juegos" :key="juego.id" :class="{ 'bg-gray-700': juego.activo, 'bg-gray-900': !juego.activo }">
                <td class="px-5 py-5 border-b border-gray-800 text-sm">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-10 h-10">
                      <img class="w-full h-full rounded-full" :src="juego.imagen" :alt="juego.nombre" />
                    </div>
                    <div class="ml-3">
                      <p class="text-gray-300 whitespace-no-wrap">{{ juego.nombre }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-5 border-b border-gray-800 text-sm">
                  <p class="text-gray-300 whitespace-no-wrap">{{ juego.descripcion }}</p>
                </td>
                <td class="px-5 py-5 border-b border-gray-800 text-sm">
                  <p class="text-gray-300 whitespace-no-wrap">{{ juego.precio }} SOL</p>
                  <p class="text-gray-300 whitespace-no-wrap">{{ (juego.precio * SOL_TO_USD_RATE).toFixed(2) }} USD</p>
                </td>
                <td class="px-5 py-5 border-b border-gray-800 text-sm">
                  <p class="text-gray-300 whitespace-no-wrap">{{ juego.vendedor || 'gsprout' }}</p>
                </td>
                <td class="px-5 py-5 border-b border-gray-800 text-sm">
                  <p class="text-gray-300 whitespace-no-wrap">{{ juego.remainingTime }}</p>
                </td>
                <td class="px-5 py-5 border-b border-gray-800 text-sm">
                  <span v-if="juego.activo" class="px-3 py-1 font-semibold text-green-900 bg-green-200 rounded-full">Activo</span>
                  <span v-else class="px-3 py-1 font-semibold text-red-900 bg-red-200 rounded-full">Inactivo</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from './navbarComponent.vue';
import Footer from './FooterComponent.vue';
import axios from 'axios';

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
    }
  }
};
</script>

<style scoped>
/* Estilos específicos para este componente van aquí */
</style>
