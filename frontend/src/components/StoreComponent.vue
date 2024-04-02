<template>
  <div class="bg-gradient-to-b from-gray-950 to-gray-700 text-white">
    <Navbar />
    <div class="p-8 rounded-md w-full">
      <div class="flex items-center justify-between pb-6">
        <div>
          <h2 class="font-semibold text-xl">Store</h2>
          <span class="text-xs text-gray-300">All available games</span>
        </div>
        <div class="flex items-center">
          <span class="text-gray-300 mr-2">Filter games:</span>
          <select class="text-gray-300 bg-gray-800 rounded-md p-2" v-model="selected" @change="filterGamesByOption(selected)">
            <option v-for="option in options" :value="option.value" :key="option.value">{{ option.text }}</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="juego in juegos" :key="juego._id" class="bg-gradient-to-b from-gray-950 to-gray-800 rounded-lg overflow-hidden shadow-lg relative cursor-pointer" @click="switchToDetails(juego._id)">
          <div class="aspect-w-16 aspect-h-9">
            <img class="w-full h-full object-cover" :src="juego.imagen" :alt="juego.nombre">
          </div>
          <button v-if="!wishlist.includes(juego._id)" @click="addToWishList(juego._id)" class="absolute top-2 right-2 text-gray-300 bg-gray-700 rounded-full p-2 focus:outline-none">
            <svg class="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
          <button v-else @click="removeFromWishList(juego._id)" class="absolute top-2 right-2 text-red-500 bg-gray-700 rounded-full p-2 focus:outline-none">
            <svg class="h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09 3.08 0 5.5 2.42 5.5 5.5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
          <div class="p-4">
            <h3 class="text-lg font-semibold">{{ juego.nombre }}</h3>
            <p class="text-gray-300">{{ juego.categoria.join(", ") }}</p>
            <!-- Mostrar la descripción solo si no estás en un dispositivo móvil -->
            <p v-if="!isMobile" class="text-gray-300 mb-4 text-justify">{{ truncar(juego.descripcion) }}</p>
            <div class="flex justify-between items-center">
              <p class="text-gray-300 font-semibold">{{ juego.precio }} USD / {{ (juego.precio / SOL_TO_USD_RATE).toFixed(9) }} SOL</p>
              <button @click="switchToDetails(juego._id)" class="px-3 py-1 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none">Details</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Navbar from './navbarComponent.vue';
import Footer from './FooterComponent.vue';
import axios from "../main";
import Swal from "sweetalert2";
import { getExchange, getUsuario, getJuegos } from "../apis";

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
      wishlist: [],
      hasMoreGames: true,
      isMobile: false // Agregar una variable para controlar si estás en un dispositivo móvil
    };
  },
  async setup(){
    const juegos = ref([]);
    const SOL_TO_USD_RATE = ref(50);
    const wishlist = ref([]);

    const requests = [getExchange(), getUsuario(), getJuegos()];

    await Promise.all(requests)
      .then((values) => {
        juegos.value = values[2];
        SOL_TO_USD_RATE.value = values[0];
        wishlist.value = values[1].wishList;
      })
      .catch((error) => {
        console.error(error);
      });

    const selected = ref('Alphabetical');
    const options = ref([
      {text: "A-Z", value:"Alphabetical"},
      //{text: "Juegos Destacados", value:"RelevantGames"},
      {text: "From highest to lowest price", value:"UpToDownPrize"},
      {text: "From lowest to highest price", value:"DownToUpPrize"}
    ])
    return{
      selected,
      options,
      juegos,
      SOL_TO_USD_RATE, 
      wishlist
    }
  },

  async created() {
    this.filterGamesByOption(this.selected);
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.handleResize(); // Llamar a la función de manejo de cambio de tamaño para determinar si estás en un dispositivo móvil
    window.addEventListener('resize', this.handleResize); // Escuchar eventos de cambio de tamaño de ventana
  },
  methods: {
    async addToWishList(juegoId) {
      try {
        const res = await axios.post("/usuarios/wishlist/" + juegoId);
        if (res.status == 200) {
          this.wishlist.push(juegoId);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Game added to favorites", 
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
            title: "Success!",
            text: "Game removed from favorites",
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
    switchToBuy(gameid) {
      this.$router.push('/solanaPay?id=' + gameid + '&&price=' + this.juegos.find(juego => juego._id === gameid).precio);
    },
    async switchToDetails(gameid) {
      try {
        const juego = this.juegos.find((game) => game._id === gameid);
        if (!juego) {
          throw new Error("Game not found");
        }
        this.$router.push(`/gameView?id=${juego._id}&price=${juego.precio}`);
      } catch (error) {
        console.error(error);
      }
    },
    filterGamesByOption(option){
      switch(option){
        case 'Alphabetical':
          this.juegos.sort((a,b)=>a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase()));
          break;
        case 'UpToDownPrize':
          this.juegos.sort((a,b)=> b.precio - a.precio);
          break;
        case 'DownToUpPrize':
          this.juegos.sort((a,b)=> a.precio - b.precio);
          break;
      }
    },
    truncar(text, maxLength = 240) {
      return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 768; // Establecer el umbral de ancho para dispositivos móviles
    },
    handleScroll() {
      const scrollBottom = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= scrollBottom - 50 && this.hasMoreGames) {
        this.loadMoreGames();
      }
    },
    async loadMoreGames() {
      this.currentPage++;
      const res = await getJuegos(this.currentPage);
      this.juegos = this.juegos.concat(res);
      this.hasMoreGames = res.length > 0;
    },
  }
};
</script>

<style scoped>
/* Estilos específicos para este componente van aquí */
</style>
