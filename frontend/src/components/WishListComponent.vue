<template>
    <div class="bg-gray-900 text-white">
      <Navbar />
      <div class="p-8 rounded-md w-full">
        <div class="flex items-center justify-between pb-6">
          <div>
            <h2 class="font-semibold">Juegos en Subasta</h2>
            <span class="text-xs">Todos los juegos disponibles</span>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex bg-gray-800 items-center p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
              <input class="bg-gray-800 outline-none ml-1 block text-white" type="text" name="" id="" placeholder="Buscar...">
            </div>
            <div class="space-x-4">
              <button class="bg-indigo-600 px-4 py-2 rounded-md font-semibold cursor-pointer">Nuevo Reporte</button>
              <button class="bg-indigo-600 px-4 py-2 rounded-md font-semibold cursor-pointer">Crear</button>
            </div>
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
                    <p class="text-gray-300 whitespace-no-wrap">{{ juego.precio }}</p>
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
  import axios from 'axios'; // Importa Axios
  
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
  