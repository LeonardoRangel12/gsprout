<template>
  <Navbar></Navbar>
  <div class="flex flex-col items-center">
    <img v-if="imageDataURL" :src="imageDataURL" alt="IMAGEN" />
    <div v-else>
      <p>Image not found</p>
    </div>
    <h1>{{ name }}</h1>
    <a :href=url><button>SELL</button></a>
  </div>
  <Footer></Footer>
</template>
<script>
import Navbar from "./navbarComponent.vue";
import Footer from "./FooterComponent.vue";
// For backend connections
import backendAxios from "../main";
// For internet connections
import axios from "axios";
import { encode, decode } from "base64-arraybuffer";
export default {
  components: {
    Navbar,
    Footer,
  },
  name: "AssetView",
  data() {
    return {
      publicKey: this.$route.params.publicKey,
      data: null,
      imageDataURL: null,
      name: null,
    };
  },
  created() {

  },
  mounted() {
    backendAxios.get("/solana/wallet/" + this.publicKey).then((response) => {
      this.data = response.data;
      console.log(this.data);
      const bufferUrl = this.data.content.links.image[0];
      const jsonUrl = this.data.content.json_uri;
      this.getAssetImage(bufferUrl);
      this.getJsonData(jsonUrl);
    });
  },
  methods: {
    getAssetImage(bufferUrl) {
      /*
      This method gets an array buffer from the bufferUrl and then encodes it to base64 to be able to display it in the img tag.
      */
      axios
        .get(bufferUrl, { responseType: "arraybuffer", responseEncoding: null })
        .then((response) => {
          const blob = encode(response.data);
          this.imageDataURL = `data:image/png;base64,${blob}`;
        });
    },
    getJsonData(url) {
      /*
      This method gets the name of the asset from the jsonUrl.
      */
      axios.get(url).then((response) => {
        this.name = response.data.name;
      });
    },
  },
};
</script>
