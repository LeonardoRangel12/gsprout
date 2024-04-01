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
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="juego in juegos" v-if="juegos" :key="juego.id" class="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer" @click="switchToDetails(juego._id)">
            <div class="w-full aspect-w-16 aspect-h-9 relative">
              <img class="w-full h-full object-cover" :src="juego.imagen" :alt="juego.nombre" />
              <button v-if="!wishlist.includes(juego._id)" @click.stop="addToWishList(juego._id)" class="absolute top-2 right-2 text-gray-500 focus:outline-none">
                <svg @click.stop="addToWishList(juego._id)" class="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
              <button v-else @click.stop="removeFromWishList(juego._id)" class="absolute top-2 right-2 text-red-500 focus:outline-none">
                <svg @click.stop="removeFromWishList(juego._id)" class="h-6 w-6 fill-current text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>
            <div class="p-4">
              <div style="height: 120px;">
                <h3 class="text-lg font-semibold">{{ juego.nombre }}</h3>
                <div div class="flex flex-nowrap mb-1">
                  <p class="text-gray-300">{{ juego.categoria.join(", ") + "." }}</p>
                </div>
              </div>
              <div class="mt-4 flex justify-between items-center">
                <div>
                  <p class="text-gray-300">{{ juego.precio }} USD / {{ (juego.precio / SOL_TO_USD_RATE).toFixed(2) }} SOL</p>
                </div>
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
import Swal from "sweetalert2"; // Importa SweetAlert2
import { getWishList, getExchange, getUsuario} from "../apis";
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
      wishlist: [],
    };
  },
  async setup() {
    const juegos = ref([]); // Inicializa juegos como un array vacío
    const exchange = ref(50); // Inicializa exchange como 50
    const wishlist = ref([]);

    await Promise.all([
      getWishList(), // Llama a la función getJuegos al crear el componente
      getExchange(),
      getUsuario(),
    ]).then((values) => {
      juegos.value = values[0]; // Asigna el valor de la lista de deseos a la variable juegos
      exchange.value = values[1];
      wishlist.value = values[2].wishList;
    }).catch((error) => {
      console.error(error); // Maneja errores
    })
    return { juegos, SOL_TO_USD_RATE: exchange, wishlist }; // Devuelve juegos
  },
  
  
  methods: {
    async addToWishList(juegoId) {
      try {
        const res = await axios.post("/usuarios/wishlist/" + juegoId);
        if (res.status == 200) {
          this.wishlist.push(juegoId);
          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: "Juego añadido a favoritos",
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    async removeFromWishList(juegoId) {
      try {
        const res = await axios.delete("/usuarios/wishlist/" + juegoId);
        if (res.status == 200) {
          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: "Juego removido de favoritos",
          });
          this.wishlist = this.wishlist.filter((id) => id !== juegoId);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async isFavorite(juegoId) {
      return this.wishlist != null ? this.wishlist.includes(juegoId) : false;
    },
    async switchToDetails(gameid) {
      try {
        const juego = this.juegos.find((game) => game._id === gameid);
        if (!juego) {
          throw new Error("Juego no encontrado");
        }
        this.$router.push(`/gameView?id=${juego._id}&price=${juego.precio}`);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
/* Estilos específicos para este componente van aquí */
</style>
