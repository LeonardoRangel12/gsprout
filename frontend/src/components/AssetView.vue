<template>
  <Navbar></Navbar>
  <div class="dark:bg-gray-900">
    <div class="container mx-auto py-8">
      <div class="grid grid-cols-1 sm:grid-cols-20 gap-6 px-4">
        <div class="col-span-1 sm:col-span-9">
          <div class="bg-gray-800 rounded-lg p-6 shadow-lg relative">
            <div
              class="absolute inset-0 bg-cover bg-center"
              :style="{
                'background-image': 'url(' + imageDataURL + ')',
                opacity: '0.4',
              }"
            ></div>
            <div
              class="flex flex-col bg-gray-700 rounded-lg p-4 shadow-lg md:flex-row"
              style="height: 625px"
            >
              <!-- Galeria -->

              <!-- Datos Juego -->
              <div class="flex flex-col relative">
                <div>
                  <img
                    class="w-full h-full object-cover"
                    style="width: 600px"
                    v-if="imageDataURL"
                    :src="imageDataURL"
                    alt="IMAGEN"
                  />
                </div>
                <div>
                  <div>
                    <h2 class="text-2xl font-bold text-white">{{ name }}</h2>
                    <div div class="flex flex-nowrap mb-1">
                      <h2 class="text-base font-bold text-white">
                        {{ categoria }}
                      </h2>
                    </div>
                    <h2 class="text-2xl font-bold mb-4 text-white text-justify">
                      Description
                    </h2>
                    <div>
                      <p class="text-white text-justify" v-if="description">
                        {{ truncar(description) }}
                      </p>
                    </div>
                  </div>
                  <div class="absolute bottom-0 left-0 right-0 flex gap-4">
                    <button
                      @click="transferNFT()"
                      class="w-full py-2 bg-indigo-700 text-white font-bold rounded hover:bg-indigo-500 transition duration-300 ease-in-out"
                    >
                      Transfer
                    </button>
                    <!-- <button @click="switchToBuy()" class="w-full py-2 bg-indigo-700 text-white font-bold rounded hover:bg-indigo-500 transition duration-300 ease-in-out">
                        Buy
                      </button> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
import { useWallet } from "solana-wallets-vue";
import { VersionedTransaction } from "@solana/web3.js";
import { connection } from "../main";
import Swal from "sweetalert2";
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
  created() {},
  mounted() {
    backendAxios.get("/solana/wallet/" + this.publicKey).then((response) => {
      this.data = response.data;
      const bufferUrl = this.data.content.links.image[0];
      const jsonUrl = this.data.content.json_uri;
      this.getAssetData(bufferUrl);
      this.getJsonData(jsonUrl);
    });
  },
  methods: {
    truncar(text, maxLength = 1200) {
      return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
    },

    getAssetData(bufferUrl) {
      /*
      This method gets an array buffer from the bufferUrl and then encodes it to base64 to be able to display it in the img tag.
      */
      axios
        .get(bufferUrl, { responseType: "arraybuffer", responseEncoding: null })
        .then((response) => {
          const blob = encode(response.data);
        });
    },
    getJsonData(url) {
      /*
      This method gets the name of the asset from the jsonUrl.
      */
      axios.get(url).then((response) => {
        console.log(response.data);
        if (!response.data._id) {
          console.error("No id found");
          return;
        }
        backendAxios
          .get("/juegos/" + response.data._id)
          .then((response) => {
            this.name = response.data.nombre;
            this.imageDataURL = response.data.imagen;
            this.imageDataGallery = response.data.gallery;
            this.category = response.data.categoria;
            this.description = response.data.descripcion; // Aquí se asigna el valor a description
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error loading asset data",
            });
          });
        // this.name = response.data.name;
        // this.imageDataURL = response.data.image;
        // this.imageDataGallery = response.data.gallery;
        // this.category = response.data.categoria;
        // this.description = response.data.description; // Aquí se asigna el valor a description
      });
    },
    async transferNFT() {
      const { publicKey, sendTransaction } = useWallet();
      const res = await backendAxios.post("/solana/transfer", {
        splToken: this.publicKey,
        publicKey: publicKey.value,
      });
      if (res.status === 200) {
        const serializedTransaction = res.data;
        const transaction = VersionedTransaction.deserialize(
          Buffer.from(serializedTransaction, "base64")
        );

        
        try {
          const signature = await sendTransaction(transaction, connection);
          await connection.confirmTransaction(signature);
        } catch (error) {
          if(!error.toString().includes("User rejected the request.")){

            await Swal.fire({
              icon: "success",
              title: "Success!",
              text: "NFT transferred successfully!",
            });
            await Swal.fire({
              icon: "info",
              title: "Information",
              text: "Converting UMI cNFT transfer transactions to Web3 Transactions is not possible at the moment. Nothing changed.",
            });
          }
        }
      } else if (res.status === 500) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Internal server error. Please try again later.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An error occurred. Please try again later.",
        });
      }
    },
  },
};
</script>
