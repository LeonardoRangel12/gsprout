<template>
  <div class="bg-gray-900 text-white">
    <Navbar />
    <div class="p-8 rounded-md w-full">
      <div class="flex items-center justify-between pb-6">
        <div>
            <h2 class="font-semibold">Store</h2>
            <span class="text-xs">All available games</span>
        </div>
        <div>
          Filtrar juegos
          <div>
            <select class ="text-gray-300 bg-gray-800" v-model = "selected" @change="filterGamesByOption(selected)">
              <option v-for="option in options" :value = "option.value">
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="juego in juegos" :key="juego.id" class="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer" @click="switchToDetails(juego._id)">
          <img class="w-full h-56 object-cover object-center" :src="juego.imagen" :alt="juego.nombre" />
          <div class="p-4">
            <div style="height: 250px;">
              <h3 class="text-lg font-semibold">{{ juego.nombre }}</h3>
              <div div class="flex flex-nowrap mb-3">
                  <p class="text-gray-300 font-semibold">{{ juego.categoria.join(", ") + "." }}</p>
                </div>
              <p class="text-gray-300 mb-4 text-justify">{{ truncar(juego.descripcion) }}</p>
            </div>
            <div class="flex justify-between items-center">
              <div >
                  <p class="text-gray-300">{{ juego.precio }} SOL / {{ (juego.precio * SOL_TO_USD_RATE).toFixed(2) }} USD</p>
                </div>
              <!--  
                <button @click="switchToDetails(juego._id)" class="px-3 py-1 bg-indigo-700 text-white font-semibold rounded hover:bg-indigo-500">Buy</button>
                -->
              </div>
          </div>
        </div>
      </div>
      <div class="flex justify-center mt-6">
        <button @click="cargarMas" class="px-4 py-2 bg-indigo-700 text-white font-semibold rounded hover:bg-indigo-500">Load more</button>
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
import axios from "../main";

export default {
  components: {
    Navbar,
    Footer
  },
  setup(){
    const selected = ref('Alphabetical');
    const options = ref([
      {text: "A-Z", value:"Alphabetical"},
      //{text: "Juegos Destacados", value:"RelevantGames"},
      {text: "De Mayor a menor precio", value:"UpToDownPrize"},
      {text: "De Menor a mayor precio", value:"DownToUpPrize"}
    ])
    return{
      selected,
      options
    }
  },
  data() {
    return {
      juegos: [],
      SOL_TO_USD_RATE: 50,
      currentPage: 1,

    };
  },
  async created() {
    await this.loadJuegos();
    this.filterGamesByOption(this.selected);
  },
  methods: {
    async loadJuegos() {
      const res = await axios.get("/juegos", { params: { page: this.currentPage } });
      if (res.status === 200) {
        this.juegos = this.juegos.concat(res.data);
        this.currentPage++;
      } else {
        console.error("Error al cargar los juegos");
      }
    },
    switchToBuy(gameid) {
      this.$router.push('/solanaPay?id=' + gameid + '&&price=' + this.juegos.find(juego => juego._id === gameid).precio);
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
    async cargarMas() {
      await this.loadJuegos();
      this.filterGamesByOption(this.selected);
    }
  }
};
</script>

<style scoped>
/* Estilos específicos para este componente van aquí */
</style>
