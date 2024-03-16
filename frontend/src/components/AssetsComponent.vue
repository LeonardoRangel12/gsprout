<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <Navbar />
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Biblioteca</h1>
      <button @click="getAssets"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
        Get Assets
      </button>
      <div v-if="isLoading" class="text-center text-gray-400 mb-4">Loading...</div>
      <div v-if="error" class="text-center text-red-600 mb-4">{{ error }}</div>
      <div v-else>
        <div v-if="assets && assets.length === 0" class="text-center text-gray-400 mb-4">No assets available.</div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="asset in assets" :key="asset.grouping.id">
            <div class="bg-gray-800 rounded shadow">
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

import { useWallet } from "solana-wallets-vue";

export default {
  components: {
    Navbar,
    AssetComponent,
    Footer,
  },
  name: "AssetsComponent",
  data() {
    return {
      assets: [],
      isLoading: false,
      error: null,
    };
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
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error fetching assets. Please try again later.'
        });
        this.error = "Error fetching assets. Please try again later.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
