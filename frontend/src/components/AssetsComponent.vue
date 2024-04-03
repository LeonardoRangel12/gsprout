<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
    <Navbar />
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Library</h1>
      <div v-if="isLoading" class="text-center text-gray-400 mb-4">Loading...</div>
      <div v-if="error" class="text-center text-red-600 mb-4">{{ error }}</div>
      <div v-else>
        <div v-if="assets && assets.length === 0" class="text-center text-gray-400 mb-4">No assets available.</div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="asset in assets" :key="asset.grouping.id">
            <div class="bg-gray-900 rounded shadow">
              <div class="aspect-w-16 aspect-h-9">
                <AssetComponent :asset="asset" class="object-cover" />
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
import Navbar from "./navbarComponent.vue";
import Footer from "./FooterComponent.vue";
import AssetComponent from "./AssetComponent.vue";
import axios from "../main";
import Swal from 'sweetalert2'; // Importa SweetAlert
import { getUserSession } from "../apis";
import { useWallet } from "solana-wallets-vue";

export default {
  components: {
    Navbar,
    AssetComponent,
    Footer,
  },
  name: "AssetsComponent",
  data() {
    const hasSession = getUserSession();
    return {
      assets: [],
      isLoading: false,
      error: null,
      interval: null,
      retryCount: 0, // variable para el contador de intentos
      connected: useWallet().connected,
      hasSession
    };
  },
  mounted() {
    if(this.hasSession == false){
      this.$router.push('/');
    }
    this.getAssets();
    if (this.assets.length === 0) {
     this.interval = setInterval(this.getAssets, 4000); // Establecer el intervalo si no hay datos
     this.retryCount = 0; // Restablecer si se recuperaron datos
    }
  },
  watch: {
    connected(val) {
      if (val)
        this.getAssets();
    },
  },
  methods: {
    async getAssets() {
      try {
        this.isLoading = true;
        this.error = null;
        
        const { publicKey } = useWallet();
        if (!publicKey.value) {
          throw new Error("No wallet connected");
        }
        
        const response = await axios.get("/solana/wallet/" + publicKey.value.toBase58() + "/1");
        this.assets = response.data.items;
        if (this.assets.length > 0) {
          clearInterval(this.interval); // Detener si se han recuperado datos
          this.retryCount = 0; // reiniciar contador de intentos
        }
      } catch (error) {
          console.error(error);
          this.retryCount++; // a(CUM)ulador de intentos fallidos

          if (this.retryCount >= 3) { // Mostrar el error después de 3 intentos fallidos
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error fetching assets. Please try again later.'
            });
            this.error = "Error fetching assets. Please try again later.";
            clearInterval(this.interval); // Detener después de mostrar el error
          }
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>