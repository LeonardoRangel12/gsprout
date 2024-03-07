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
      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table class="min-w-full leading-normal">
            <thead>
              <tr>
                <th
                  class="px-5 py-3 border-b-2 border-gray-800 bg-gray-800 text-left text-xs font-semibold uppercase tracking-wider">
                  Nombre
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-800 bg-gray-800 text-left text-xs font-semibold uppercase tracking-wider">
                  Precio
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-800 bg-gray-800 text-left text-xs font-semibold uppercase tracking-wider">
                  Vendedor
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-800 bg-gray-800 text-left text-xs font-semibold uppercase tracking-wider">
                  
                </th>
                <th
                  class="px-5 py-3 border-b-2 border-gray-800 bg-gray-800 text-left text-xs font-semibold uppercase tracking-wider">
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="juego in juegos" :key="juego.id"
                :class="{ 'bg-gray-700': juego.activo, 'bg-gray-900': !juego.activo }">
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
                  <p class="text-gray-300 whitespace-no-wrap">{{ juego.precio }} SOL</p>
                  <p class="text-gray-300 whitespace-no-wrap">{{ (juego.precio * SOL_TO_USD_RATE).toFixed(2) }} USD</p>
                </td>
                <td class="px-5 py-5 border-b border-gray-800 text-sm">
                  <p class="text-gray-300 whitespace-no-wrap">{{ juego.vendedor || 'gsprout' }}</p>
                </td>
                <td class="px-5 py-5 border-b border-gray-800 text-sm">
                  <button type="submit" @click="switchToBuy(juego._id)"
                    class="py-1 px-2 bg-indigo-700 text-white font-bold rounded hover:bg-indigo-500">Comprar</button>
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
