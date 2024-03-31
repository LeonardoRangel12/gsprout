<template>
  <div class="flex flex-col items-center bg-gradient-to-b from-gray-950 to-gray-900 rounded-lg overflow-hidden">
    <div v-if="isImageLoading">
      <p>Loading Image...</p>
    </div>
    <div v-else-if="isImageLoadingError">
      <p>Error Loading Image</p>
    </div>
    <img class = "mb-3" v-else-if="imageDataURL" :src="imageDataURL" alt="IMAGEN" />
    <div v-else>
      <p>Image not found</p>
    </div>
    <h1 class = "mb-3">{{ name }}</h1>
    <button @click="redirectToUrl" class="mb-5 px-3 py-1 bg-indigo-700 text-white font-semibold rounded hover:bg-indigo-500">Details</button>
  </div>
</template>
<script>
import axios from 'axios';
import { encode } from 'base64-arraybuffer';

export default {
  name: 'AssetComponent',
  props: {
    asset: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      imageDataURL: null,
      name: null,
      url: null,
      isImageLoading: false,
      isImageLoadingError: false,
    };
  },
  mounted() {
    this.loadAssetData();
  },
  methods: {
    async loadAssetData() {
      try {
        this.isImageLoading = true;
        const imageUrl = this.asset.content.links.image[0];
        const jsonUrl = this.asset.content.json_uri;

        const [imageResponse, jsonResponse] = await Promise.all([
          axios.get(imageUrl, { responseType: 'arraybuffer' }),
          axios.get(jsonUrl),
        ]);

        const blob = encode(imageResponse.data);
        this.imageDataURL = jsonResponse.data.image;
        this.name = jsonResponse.data.name;
        this.url = `/mygames/${this.asset.id}`;
      } catch (error) {
        console.error('Error al cargar los datos del activo:', error);
        this.isImageLoadingError = true;
      } finally {
        this.isImageLoading = false;
      }
    },
    redirectToUrl() {
      window.location.href = this.url;
    },
  },
};
</script>