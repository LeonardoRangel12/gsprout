<template>
  <Navbar></Navbar>
  <button @click="getAssets()">Get Assets</button>
  <!-- <div v-for="asset in assets" :key="asset.grouping.id">{{ asset.content  }} -->

  <!-- </div> -->
  <div v-for="asset in assets" :key="asset.grouping.id">
    <AssetComponent :asset="asset"></AssetComponent>
    </div>
  <Footer></Footer>
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
    AssetComponent: AssetComponent,
    Footer,
  },
  name: "AssetsComponent",
  data() {
    return {
      assets: [],
    };
  },
  async created() {},
  methods: {
    async getAssets() {
      try {
        const {publicKey} = useWallet();
        if (!publicKey.value) {
          alert("No wallet connected");
          return;
        }
        const {data:assets} = await axios.get("/solana/wallet/" + publicKey.value.toBase58() + "/1");
        
        console.log(assets);
        this.assets = assets.items;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
