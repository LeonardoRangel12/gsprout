<template>
   <Navbar />
  <div class="min-h-screen bg-gray-100 flex flex-col">
   
    <div class="flex-grow p-6">
      <button @click="getAssets"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Get Assets
      </button>
      <div v-if="isLoading" class="mt-4 text-center text-gray-600">Loading...</div>
      <div v-else-if="error" class="mt-4 text-center text-red-600">{{ error }}</div>
      <div v-else>
        <div v-if="assets && assets.length === 0" class="mt-4 text-center text-gray-600">No assets available.</div>

        <div v-else>
          <div v-for="asset in assets" :key="asset.grouping.id" class="mt-4">
            <AssetComponent :asset="asset" />
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
        this.error = "Error fetching assets.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
