<template>
  <div class="bg-gray-950">
    <Navbar />
    <div class="container mx-auto py-8">
      <div :class="{ 'hidden md:block': !isSmallScreen }">
        <!-- Código para pantallas grandes (md y superiores) -->
        <div class="grid grid-cols-1 md:grid-cols-20 gap-6 px-4">
          <div class="col-span-1 md:col-span-9">
            <div class="bg-gray-900 rounded-lg p-6 shadow-lg">
              <div class="flex flex-col bg-gray-900 rounded-lg p-4 shadow-lg md:flex-row" style="height: 625px;">
                <!-- Galeria -->
                <div class="grid gap-4 mb-4 md:mb-0 md:mr-4">
                  <div> 
                    <img class="h-auto w-full rounded-lg" style="width: 2800px; height: 450px;" :src="selectedImageUrl" alt="">
                  </div> 
                  <div class="overflow-x-auto custom-scrollbar flex items-center" style="height: 115px;"> 
                    <div class="flex flex-nowrap mb-1">
                      <div v-for="(imageUrl, index) in juego.gallery" :key="index" class="h-auto max-w-full flex-none cursor-pointer mr-4"> 
                        <img class="h-full w-full object-cover rounded-lg"
                             :class="{
                               'border-4 border-white shadow-lg transform scale-110': index === selectedImageIndex,
                               'ml-2': index === 0, // Agrega separación del borde izquierdo a la primera imagen
                             }" style="width: 157.5px" :src="imageUrl" :alt="`Imagen ${index + 1}`" @click="selectImage(imageUrl, index)"/>
                      </div> 
                    </div> 
                  </div> 
                </div> 
                <!-- Datos del Juego -->
                <div class="flex flex-col relative">
                  <div>
                    <img class="w-full h-full object-cover" style="width: 600px;" :src="juego.imagen" :alt="juego.nombre" />
                  </div>
                  <div>
                    <div>
                      <h2 class="text-2xl md:text-3xl font-bold text-white">{{ juego.nombre }}</h2>
                      <div div class="flex flex-nowrap mb-1">
                        <h2 class="text-base md:text-lg font-bold text-white">{{ juego.categoria.join(", ") + "." }}</h2>
                      </div>
                      <h2 class="text-2xl md:text-3xl font-bold mb-4 text-white">Description</h2>
                      <div>
                        <p class="text-gray-400 text-justify text-sm md:text-base">{{ truncar(juego.descripcion) }}</p>
                      </div>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0">
                      <button @click="switchToBuy()" class="w-full py-2 bg-indigo-700 text-white font-bold rounded hover:bg-indigo-500 transition duration-300 ease-in-out text-sm md:text-base">
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div :class="{ 'md:hidden': !isSmallScreen }">
        <!-- Código para pantallas pequeñas (sm y menores) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
          <!-- Portada del juego -->
          <div class="bg-gray-900 rounded-lg shadow-lg">
            <img class="w-full h-auto rounded-t-lg" :src="juego.imagen" :alt="juego.nombre">
          </div>
          <!-- Detalles del juego -->
          <div class="bg-gray-900 rounded-lg shadow-lg">
            <div class="p-6">
              <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">{{ juego.nombre }}</h2>
              <div class="mb-4">
                <h3 class="text-lg md:text-xl font-bold text-white">{{ juego.categoria.join(", ") }}</h3>
              </div>
              <div class="mb-4">
                <h3 class="text-lg md:text-xl font-bold text-white">Description</h3>
                <p class="text-gray-400 text-justify text-sm md:text-base">{{ truncar(juego.descripcion) }}</p>
              </div>
              <div>
                <button @click="switchToBuy()" class="w-full py-2 bg-indigo-700 text-white font-bold rounded hover:bg-indigo-500 transition duration-300 ease-in-out text-sm md:text-base">
                  Buy
                </button>
              </div>
            </div>
          </div>
          <!-- Galería de imágenes -->
          <div class="bg-gray-900 rounded-lg shadow-lg mt-6" ref="carousel">
          <div class="p-4">
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">Gallery</h2>
            <div class="slick-carousel">
              <div v-for="(imageUrl, index) in juego.gallery" :key="index" class="h-auto max-w-full flex-none cursor-pointer mb-2">
                <img class="h-auto w-full object-cover rounded-lg" :class="{
                  'border-4 border-white shadow-lg transform scale-110': index === selectedImageIndex,
                }" :src="imageUrl" :alt="`Image ${index + 1}`" @click="selectImage(imageUrl, index)" />
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
      selectedImageUrl: [],
      reference: "",
      isMobile: false,
      selectedImageIndex: 0,
      isSmallScreen: false,
    };
  },
  created() {
    this.getJuego();
  },
  mounted() {
    this.checkScreenSize();
    this.initCarousel();
    this.startSlideshow();
    window.addEventListener('resize', this.checkScreen);
  },

  computed: {
    $screenWidth() {
      return window.innerWidth;
    }
  },
  methods: {
    async getJuego() {
      try {
        const response = await axios.get("/juegos/" + this.$route.query.id);
        this.juego = response.data;
        this.selectedImageUrl = this.juego.gallery[0];
      } catch (error) {
        console.error(error);
      }
    },
    /* El coco
    checkScreen() {
      this.isSmallScreen = window.innerWidth <= 768; // Define el límite de ancho para dispositivos móviles
    },*/
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
