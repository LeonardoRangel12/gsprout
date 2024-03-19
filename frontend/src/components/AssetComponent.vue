<template>
  <div class="flex flex-col items-center">
    <img v-if="imageDataURL" :src="imageDataURL" alt="IMAGEN" @error="handleImageError" /> <!-- SOLO agregue el evento @error para saner si la imagen se cargo-->
  <div v-else>
    <p>Image not found</p>
  </div>
  <h1>{{ name }}</h1>
  <a :href=url><button>DETAILS</button></a>
  </div>
</template>
<script>
import axios from "axios";
import { encode, decode } from "base64-arraybuffer";
export default {
  name: "AssetComponent",
  props: {
    asset: {
      type: JSON,
      required: true,
    },
  },
  data() {
    return {
      imageDataURL: null,
      name: null,
      url: null,
      isImageLoading: false // Nueva propiedad para indicar si la imagen se está cargando
    };
  },
  mounted() {
    const bufferUrl = this.asset.content.links.image[0];
    const jsonUrl = this.asset.content.json_uri;
    this.getAssetImage(bufferUrl);
    this.getJsonData(jsonUrl);
    this.url = "/mygames/" + this.asset.id;
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
    handleImageError() {
      console.error('Error al cargar la imagen');
      this.imageDataURL = null; // Establece imageDataURL en null para mostrar el mensaje "Image not found"
    },
  },
};
</script>
