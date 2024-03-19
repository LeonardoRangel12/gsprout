<template>
  <Navbar></Navbar>
  <div class="dark:bg-gray-900">
    <div class="container mx-auto py-8">
      <div class="grid grid-cols-1 sm:grid-cols-20 gap-6 px-4">
        <div class="col-span-1 sm:col-span-9">
          <div class="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div class="flex flex-col bg-gray-700 rounded-lg p-4 shadow-lg md:flex-row">
              <div class="grid gap-4 mb-4 md:mb-0 md:mr-4">
                <div>
                  <img class="h-auto w-full rounded-lg" src="https://imgur.com/jFEwdGp.jpg" alt="">
                </div>
                <div class="grid grid-cols-5 gap-4">
                  <div>
                    <img class="h-auto max-w-full rounded-lg" src="https://imgur.com/bMDFXHK.jpg" alt="">
                  </div>
                  <div>
                    <img class="h-auto max-w-full rounded-lg" src="https://imgur.com/75SiTJW.jpg" alt="">
                  </div>
                  <div>
                    <img class="h-auto max-w-full rounded-lg" src="https://imgur.com/APzwUim.jpg" alt="">
                  </div>
                  <div>
                    <img class="h-auto max-w-full rounded-lg" src="https://imgur.com/HLyiTZu.jpg" alt="">
                  </div>
                  <div>
                    <img class="h-auto max-w-full rounded-lg" src="https://imgur.com/J0kJ5Fh.jpg" alt="">
                  </div>
                </div>
              </div>
              <div class="flex flex-col">
                <div>
                  <img class="w-full h-full object-cover mb-6" v-if="imageDataURL" :src="imageDataURL" alt="IMAGEN" />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-white mb-8">{{ name }}</h2>
                    <div class="flex flex-col  justify-end">
                      <button @click="switchToBuy()" class="px-4 py-2 bg-indigo-700 text-white font-bold rounded hover:bg-indigo-500 transition duration-300 ease-in-out">
                        SELL
                      </button>
                      <!--<a :href=url><button>SELL</button></a>-->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <Footer></Footer>
  </div>
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
      this.getAssetData(bufferUrl);
      this.getJsonData(jsonUrl);
    });
  },
  methods: {
    getAssetData(bufferUrl) {
      /*
      This method gets an array buffer from the bufferUrl and then encodes it to base64 to be able to display it in the img tag.
      */
      axios.get(bufferUrl, { responseType: "arraybuffer", responseEncoding: null })
        .then((response) => {
          const blob = encode(response.data);
        });
    },
    getJsonData(url) {
      /*
      This method gets the name of the asset from the jsonUrl.
      */
      axios.get(url).then((response) => {
        this.name = response.data.name;
        //carga la imagen
        this.imageDataURL = response.data.image;
      });
    },
  },
};
</script>
