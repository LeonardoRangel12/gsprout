<template>
  <div class="bg-gray-900 text-white">
    <Navbar />
    <div class="container mx-auto py-8">
      <div class="px-4 sm:px-8">
        <div class="flex items-center justify-between pb-6">
          <div>
            <h2 class="text-3xl font-semibold">WishList</h2>
            <p class="text-gray-400">Explora tus juegos favoritos</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input type="text" placeholder="Buscar..." class="bg-gray-800 text-white px-4 py-2 rounded-md outline-none">
              <svg class="absolute top-3 right-4 h-6 w-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m5-6a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full divide-y divide-gray-800">
            <thead class="bg-gray-800">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Descripción</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Precio</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-800">
              <tr v-for="juego in juegos" :key="juego.id" :class="{ 'bg-gray-700': juego.activo, 'bg-gray-800': !juego.activo }">
                <td class="px-6 py-8 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 w-16 h-16">
                      <img :src="juego.imagen" alt="juego.nombre" class="w-full h-full rounded-md">
                    </div>
                    <div class="ml-4">
                      <div class="text-sm font-medium text-gray-300">{{ juego.nombre }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-8 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{{ juego.descripcion }}</div>
                </td>
                <td class="px-6 py-8 whitespace-nowrap">
                  <div class="text-sm text-gray-300">{{ juego.precio }}</div>
                </td>
                <td class="px-6 py-8 whitespace-nowrap text-right text-sm font-medium">
                  <button class="text-indigo-600 hover:text-indigo-900">Comprar</button>
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
import axios from '../main'; // Importa Axios

export default {
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      juegos: [] // Inicializa juegos como un array vacío
    };
  },
  async created() {
    await this.getJuegos(); // Llama a la función getJuegos al crear el componente
  },
  methods: {
    async getJuegos() {
      try {
        const response = await axios.get('/juegos'); // Hace una solicitud GET a '/juegos'
        this.juegos = response.data; // Asigna los datos de la respuesta a la variable juegos
      } catch (error) {
        console.error('Error al obtener juegos:', error); // Manejo de errores
      }
    }
  }
};
</script>

<style scoped>
/* Estilos específicos para este componente van aquí */
</style>
