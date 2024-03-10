<template>
</template>
<script>
import { useWallet } from "solana-wallets-vue";
import * as  metaplex from "../../../shared/utils/metaplex.util"
import Navbar from "./navbarComponent.vue";
import Footer from "./FooterComponent.vue";
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
  async created() {
    const wallet = useWallet();
    if (wallet.publicKey) {
      const res = await metaplex.getWalletNFTs(wallet.publicKey)
      console.log(res);
    }
  },
};
</script>
