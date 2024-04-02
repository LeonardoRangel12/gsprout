<template>
  <div class="bg-gray-950">
    <Navbar />
    <div class="container mx-auto py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        <!-- Portada del juego -->
        <div class="bg-gray-900 rounded-lg shadow-lg">
          <img class="w-full h-auto rounded-t-lg" :src="juego.imagen" :alt="juego.nombre">
        </div>
        <!-- Detalles del juego -->
        <div class="bg-gray-900 rounded-lg shadow-lg">
          <div class="p-6">
            <h2 class="text-2xl font-bold text-white mb-2">{{ juego.nombre }}</h2>
            <div class="mb-4">
              <h3 class="text-lg font-bold text-white">{{ juego.categoria.join(", ") }}</h3>
            </div>
            <div class="mb-4">
              <h3 class="text-lg font-bold text-white">Description</h3>
              <p class="text-gray-400 text-justify">{{ truncar(juego.descripcion) }}</p>
            </div>
            <div>
              <button @click="switchToBuy()" class="w-full py-2 bg-indigo-700 text-white font-bold rounded hover:bg-indigo-500 transition duration-300 ease-in-out">
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Galería de imágenes -->
      <div class="bg-gray-900 rounded-lg shadow-lg mt-6" ref="carousel">
        <div class="p-4">
          <h2 class="text-2xl font-bold text-white mb-2">Gallery</h2>
          <div class="slick-carousel">
            <div v-for="(imageUrl, index) in juego.gallery" :key="index" class="h-auto max-w-full flex-none cursor-pointer mb-2">
              <img class="h-auto w-full object-cover rounded-lg" 
                :class="{
                  'border-4 border-white shadow-lg transform scale-110': index === selectedImageIndex,
                }" :src="imageUrl" :alt="`Image ${index + 1}`" @click="selectImage(imageUrl, index)"/>
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
import Navbar from "./navbarComponent.vue";
import Footer from "./FooterComponent.vue";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import $ from 'jquery';
import 'slick-carousel';

export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      juego: {},
      selectedImageIndex: 0,
      isMobile: false,
    };
  },
  created() {
    this.getJuego();
  },
  mounted() {
    this.checkScreenSize();
    this.initCarousel();
  },
  methods: {
    async getJuego() {
      try {
        const response = await axios.get("/juegos/" + this.$route.query.id);
        this.juego = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    truncar(text, maxLength = 280) {
      return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
    },
    async switchToBuy() {
      try {
        const response = await axios.get("/juegos/" + this.$route.query.id);
        const juego = response.data;
        if (!juego) {
          throw new Error("Juego no encontrado");
        }
        const priceInUsd = (juego.precio / this.SOL_TO_USD_RATE).toFixed(2);
        this.$router.push(`/solanaPay?id=${juego._id}&price=${priceInUsd}`);
      } catch (error) {
        console.error(error);
      }
    },
    selectImage(imageUrl, index) {
      this.selectedImageIndex = index;
    },
    checkScreenSize() {
      this.isMobile = window.innerWidth <= 768; // Define el límite de ancho para dispositivos móviles
    },
    initCarousel() {
      $(this.$refs.carousel).find('.slick-carousel').slick({
        slidesToShow: this.isMobile ? 1 : 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
      });
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
