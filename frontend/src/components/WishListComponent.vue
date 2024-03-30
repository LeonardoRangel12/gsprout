<template>
  <div class="bg-gray-900 text-white">
    <Navbar />
    <div class="container mx-auto py-8">
      <div class="px-4 sm:px-8">
        <div class="flex items-center justify-between pb-6">
          <div>
            <h2 class="text-3xl font-semibold">WishList</h2>
            <p class="text-gray-400">Explore your favorite games</p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input
                type="text"
                placeholder="Buscar..."
                class="bg-gray-800 text-white px-4 py-2 rounded-md outline-none"
              />
              <svg
                class="absolute top-3 right-4 h-6 w-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m5-6a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <div
            v-for="juego in juegos"
            v-if="juegos"
            :key="juego.id"
            class="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
          >
            <div class="w-full h-64 bg-gray-600">
              <img
                class="w-full h-full object-cover"
                :src="juego.imagen"
                :alt="juego.nombre"
              />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold">{{ juego.nombre }}</h3>
              <p class="text-gray-300">{{ juego.descripcion }}</p>
              <div class="mt-4 flex justify-between items-center">
                <div>
                  <p class="text-gray-300">{{ juego.precio }} SOL</p>
                  <p class="text-gray-300">
                    {{ (juego.precio * SOL_TO_USD_RATE).toFixed(2) }} USD
                  </p>
                </div>
                <button
                  @click="switchToBuy(juego._id)"
                  class="px-4 py-2 bg-indigo-700 text-white font-bold rounded hover:bg-indigo-500 transition duration-300 ease-in-out"
                >
                 Buy
                </button>
              </div>
            </div>
          </div>
          <div v-else>
            <h2 class="text-3xl font-semibold">You have no games in your list</h2>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from "./navbarComponent.vue";
import Footer from "./FooterComponent.vue";
import axios from "../main"; // Importa Axios
import { getWishList } from "../apis";
import { ref } from "vue";
export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      juegos: ref([]), // Inicializa juegos como un array vacío
      SOL_TO_USD_RATE: 50, // Adjust this value based on the current exchange rate
    };
  },
  async setup() {
    const juegos = ref([]); // Inicializa juegos como un array vacío


    await Promise.all([
      getWishList(), // Llama a la función getJuegos al crear el componente
    ]).then((values) => {
      juegos.value = values[0]; // Asigna el valor de la lista de deseos a la variable juegos
    }).catch((error) => {
      console.error(error); // Maneja errores
    })
    return { juegos }; // Devuelve juegos
  },
  methods: {
  },
};
</script>

<style scoped>
/* Estilos específicos para este componente van aquí */
</style>
