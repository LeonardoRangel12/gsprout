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
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="juego in juegos"
          :key="juego.id"
          class="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
        >
          <img
            class="w-full h-56 object-cover object-center"
            :src="juego.imagen"
            :alt="juego.nombre"
          />
          <div class="p-4">
            <div style="height: 180px">
              <h3 class="text-lg font-semibold">{{ juego.nombre }}</h3>
              <p class="text-gray-300 mb-4">{{ truncar(juego.descripcion) }}</p>
            </div>
            <div class="flex justify-between items-center">
              <div>
                <p class="text-gray-300 mb-2">{{ juego.precio }} SOL</p>
                <p class="text-gray-300">
                  {{ (juego.precio * SOL_TO_USD_RATE).toFixed(2) }} USD
                </p>
              </div>
              <button
                @click="switchToBuy(juego._id)"
                class="px-3 py-1 bg-indigo-700 text-white font-semibold rounded hover:bg-indigo-500"
              >
                Comprar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { ref } from "vue";
import Navbar from "./navbarComponent.vue";
import Footer from "./FooterComponent.vue";
import { getExchange, getWishList, getJuegos } from "../apis";
import axios from "../main"
export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      juegos: [],
      SOL_TO_USD_RATE: 50, // Ajusta este valor según el tipo de cambio actual
      page: 1,
    };
  },
  
  async setup() {
    const exchange = ref(50);
    const juegos = ref([]);
    await Promise.all([getExchange(), getWishList(), getJuegos()])
      .then((values) => {
        juegos.value = values[2];
        exchange.value = values[0];
      })
      .catch((error) => {
        console.error(error);
      });
    return { juegos, SOL_TO_USD_RATE: exchange };
  },
  async created() {
    
  },
  methods: {
    switchToBuy(gameid) {
      // Redirect the user to the registration page
      this.$router.push(
        "/solanaPay?id=" +
          gameid +
          "&&price=" +
          this.juegos.find((juego) => juego._id === gameid).precio
      );
    },
    truncar(text, maxLength = 240) {
      return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
    },
    // async loadJuegos(page = 1){
    //   const res = await axios.get("/juegos", { params: { page } });
    //   if(res.status === 200){
    //     this.juegos = this.juegos.concat(res.data);
    //   }
    //   else if (res.status === 404){
    //     console.warn("No hay juegos disponibles");
    //   }
    //   else if (res.status === 500){
    //     console.error("Error al cargar los juegos");
    //   }
    //   else {
    //     console.error("Error desconocido");
    //   }
    // }
  },
};
</script>

<style scoped>
/* Estilos específicos para este componente van aquí */
</style>
