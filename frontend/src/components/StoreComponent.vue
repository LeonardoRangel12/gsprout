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
            <div style="height: 180px;">
              <h3 class="text-lg font-semibold">{{ juego.nombre }}</h3>
              <p class="text-gray-300 mb-4">{{ truncar(juego.descripcion) }}</p>
            </div>
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
      <!-- Paginación -->
      <div class="flex justify-center mt-6">
        <button @click="previousPage" :disabled="currentPage === 1" class="px-3 py-1 bg-indigo-700 text-white font-semibold rounded mr-2">Anterior</button>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 bg-indigo-700 text-white font-semibold rounded">Siguiente</button>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { ref } from 'vue';
import Navbar from './navbarComponent.vue';
import Footer from './FooterComponent.vue';
import { getExchange, getWishList, getJuegos } from "../apis";

export default {
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      juegos: [],
      SOL_TO_USD_RATE: 50,
      currentPage: 1,
      pageSize: 20
    };
  },
  async setup(){
    const exchange = ref(50);
    const juegos = ref([]);
    await Promise.all([getExchange(), getWishList(), getJuegos(this.currentPage)]).then((values) => {
      juegos.value = values[2];
      exchange.value = values[0];
    }).catch((error) => {
      console.error(error);
    });
    return { juegos, SOL_TO_USD_RATE: exchange };
  },
  methods: {
    switchToBuy(gameid) {
      this.$router.push('/solanaPay?id=' + gameid + '&&price=' + this.juegos.find(juego => juego._id === gameid).precio);
    },
    truncar(text, maxLength = 240) {
      return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
    },
    async nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        await this.loadJuegos();
      }
    },
    async previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        await this.loadJuegos();
      }
    },
    async loadJuegos() {
      try {
        const response = await getJuegos(this.currentPage);
        this.juegos = response;
      } catch (error) {
        console.error(error);
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.juegos.length / this.pageSize);
    }
  }
};
</script>

<style scoped>

</style>
