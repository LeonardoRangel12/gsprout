<template>
  <Navbar></Navbar>
  <button @click="getAssets()">Get Assets</button>
  <Footer></Footer>
</template>
<script>

import Navbar from "./navbarComponent.vue";
import Footer from "./FooterComponent.vue";
import axios from "../main";
import { useWallet } from "solana-wallets-vue";
import { PublicKey } from "@solana/web3.js";
export default {
  components: {
    Navbar,
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
        const {data:assets} = await axios.get("/solana/wallet/" + publicKey.value.toBase58());
        console.log(assets);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
