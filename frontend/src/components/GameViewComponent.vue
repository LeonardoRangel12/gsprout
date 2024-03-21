<template>
  <div class="dark:bg-gray-900">
    <Navbar />
      <div class="container mx-auto py-8">
        <div class="grid grid-cols-1 sm:grid-cols-20 gap-6 px-4">
          <div class="col-span-1 sm:col-span-9">
            <div class="bg-gray-800 rounded-lg p-6 shadow-lg" >
              <div class="flex flex-col bg-gray-700 rounded-lg p-4 shadow-lg md:flex-row">
              <div>
              </div>
                <div class="carousel relative ">
                  <div class="carousel-inner flex overflow-x-hidden">
                    <div v-for="(image, index) in images" :key="index">
                      <img
                        class="h-64 w-full object-cover rounded-lg transition duration-500 ease-in-out"
                        :src="image.src"
                        :alt="image.alt"
                        :class="{ 'hidden': currentSlideIndex !== index }"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    class="carousel-control-prev absolute top-0 left-0 flex items-center justify-center h-full px-4 bg-gray-transparent focus:outline-none hover:bg-gray-200 rounded-lg"
                    aria-label="Previous"
                    @click="prevSlide"
                  >
                    <svg class="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L10.586 3.293H1a1 1 0 01-1-1V1a1 1 0 011-1h9a1 1 0 011 1v2.293l-1.293 1.293z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    class="carousel-control-next absolute top-0 right-0 flex items-center justify-center h-full px-4 bg-gray-transparent focus:outline-none hover:bg-gray-200 rounded-lg"
                    aria-label="Next"
                    @click="nextSlide"
                  >
                    <svg class="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10.586H1a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 011.414-1.414L14 12.707l-6.707 6.707z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div class="flex flex-col">
                  <div>
                    <img class="w-full h-full object-cover" :src="juego.imagen" :alt="juego.nombre" />
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold text-white">{{ juego.nombre }}</h2>
                    <h2 class="text-base font-bold mb-4 text-white">{{ juego.categoria }}</h2>
                    <h2 class="text-2xl font-bold mb-4 text-white">Descripcion</h2>
                    <p class="text-gray-400 mb-4">{{ juego.descripcion }} 
                    </p>
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
      reference: "",
      SOL_TO_USD_RATE: 0,
      price: 0,
      

      images: [
        { src: 'https://imgur.com/jFEwdGp.jpg', alt: 'Image 1' },
        { src: 'https://imgur.com/bMDFXHK.jpg', alt: 'Image 2' },
        { src: 'https://imgur.com/APzwUim.jpg', alt: 'Image 3' },
        { src: 'https://imgur.com/HLyiTZu.jpg', alt: 'Image 4' },
        { src: 'https://imgur.com/J0kJ5Fh.jpg', alt: 'Image 5' },
        // Add more image objects here
      ],
      currentSlideIndex: 0,
    };
  },
  async created() {
    await this.getExchange();
    await this.getJuegos();
  },
  methods: {
    prevSlide() {
      this.currentSlideIndex = (this.currentSlideIndex - 1 + this.images.length) % this.images.length; // Handle underflow
    },
    nextSlide() {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.images.length;
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
      console.log(response);
      console.log(this.$route.query.id);
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
</style>