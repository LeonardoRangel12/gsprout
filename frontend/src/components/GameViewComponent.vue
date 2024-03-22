<template>
  <div class="dark:bg-gray-900">
    <Navbar />
      <div class="container mx-auto py-8">
        <div class="grid grid-cols-1 sm:grid-cols-20 gap-6 px-4">
          <div class="col-span-1 sm:col-span-9">
            <div class="bg-gray-800 rounded-lg p-6 shadow-lg" >
              <div class="flex flex-col bg-gray-700 rounded-lg p-4 shadow-lg md:flex-row" style="height: 625px;">
                <!-- Galeria -->
                <div class="grid gap-4 mb-4 md:mb-0 md:mr-4">
                  <div>
                    <img class="h-auto w-full rounded-lg" style="width: 2800px; height: 450px;" :src="selectedImageUrl" alt="" >
                  </div>
                  <div class="overflow-x-auto custom-scrollbar flex items-center" style="height: 115px;">
                    <div class="flex flex-nowrap mb-1" >
                      <div v-for="(imageUrl, index) in juego.gallery" :key="index" class="h-auto max-w-full flex-none cursor-pointer mr-4">
                        <img class="h-full w-full object-cover rounded-lg" 
                        :class="{
                          'border-4 border-white shadow-lg transform scale-110': index === selectedImageIndex,
                          'ml-2': index === 0, // Agrega separación del borde izquierdo a la primera imagen
                        }" style="width: 157.5px":src="imageUrl":alt="`Imagen ${index + 1}`"@click="selectImage(imageUrl, index)"/>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Datos Juego -->
                <div class="flex flex-col">
                  <div>
                    <img class="w-full h-full object-cover" style="width: 600px;" :src="juego.imagen" :alt="juego.nombre" />
                  </div>
                  <div>
                    <div style="height: 280px;">
                      <h2 class="text-2xl font-bold text-white">{{ juego.nombre }}</h2>
                      <div div class="flex flex-nowrap mb-1">
                        <h2 class="text-base font-bold text-white">{{ juego.categoria.join(", ") + "." }}</h2>
                      </div>
                      <h2 class="text-2xl font-bold mb-4 text-white">Descripcion</h2>
                      <p class="text-gray-400 mb-4">{{ truncar(juego.descripcion) }} 
                      </p>
                    </div>
                    <div class="flex flex-col  justify-end">
                      <button @click="switchToBuy()" class="px-4 py-2 bg-indigo-700 text-white font-bold rounded hover:bg-indigo-500 transition duration-300 ease-in-out">
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <Footer />
  </div>
</template>
  
<script>
import axios from "../main";
import { connection } from "../main";
import SolanaPayComponent from './SolanaPayComponent.vue';
import Navbar from "./navbarComponent.vue";
import Footer from "./FooterComponent.vue";
export default {
  components: {
    Navbar,
    Footer,
    SolanaPayComponent,
  },
  data() {
    return {
      juego: [],
      selectedImageUrl: [],
      reference: "",
      SOL_TO_USD_RATE: 0,
      price: 0,
      selectedImageIndex: 0,
    };
  },
  mounted() {

  },
  async created() {
    await this.getExchange();
    await this.getJuegos();
  },
  
  methods: {
    startSlideshow() {
      this.selectedImageUrl = this.juego.gallery[this.selectedImageIndex];
      this.intervalId = setInterval(this.nextImage, 3000); //cambia cada 3 segundos
    },
    stopSlideshow() {
      clearInterval(this.intervalId);
    },
    nextImage() {
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.juego.gallery.length;
      this.selectedImageUrl = this.juego.gallery[this.selectedImageIndex];
    },

    async selectImage(imageUrl, index) {
      this.selectedImageUrl = imageUrl;
      this.selectedImageIndex = index;
    },    
    truncar(text, maxLength = 280) {
      return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
    },
    async getJuegos() {
      /*
      try {
        const response = await axios.get("/juegos/" + this.$route.query.id);
        this.juego = response.data;
      } catch (error) {
        console.error(error);
      }*/
      const response = await axios.get("/juegos/" + this.$route.query.id);
      this.juego = response.data;
      this.selectedImageUrl = this.juego.gallery[0];
      console.log(response);
      console.log(this.$route.query.id);
      this.startSlideshow(); // Inicia el slideshow
    },
    async getExchange() {
      try {
        const res = await axios.get("/exchange");
        this.SOL_TO_USD_RATE = res.data.sell;
        this.price = this.$router.currentRoute.value.query.price;
      } catch (error) {
        console.error(error);
      }
    },
    async switchToBuy() {
      try {
        const response = await axios.get("/juegos/" + this.$route.query.id);
        const juego = response.data;
        if (!juego) {
          throw new Error("Juego no encontrado");
        }
        this.$router.push(`/solanaPay?id=${juego._id}&price=${juego.precio}`);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>

.dark {
  background-color: #1a1a1a;
  /* Dark gray background */
}
.custom-scrollbar::-webkit-scrollbar {
  @apply h-2; /* Altura de la barra de scroll */
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-200 rounded-full; /* Color de fondo del área de la barra de scroll */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-500 rounded-full; /* Color de la barra de scroll */
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-600; /* Color de la barra de scroll al pasar el mouse por encima */
}
</style>