<template>
  <img v-if="imageDataURL" :src="imageDataURL" alt="IMAGEN" />
  <div v-else>
    <p>Image not found</p>
  </div>
  <h1>{{ name }}</h1>
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
    };
  },
  mounted() {
    const bufferUrl = this.asset.content.links.image[0];
    const jsonUrl = this.asset.content.json_uri;
    this.getAssetImage(bufferUrl);
    this.getJsonData(jsonUrl);
  },
  methods: {
    getAssetImage(bufferUrl) {
      axios
        .get(bufferUrl, { responseType: "arraybuffer", responseEncoding: null })
        .then((response) => {
          const blob = encode(response.data);
          this.imageDataURL = `data:image/png;base64,${blob}`;
        });
    },
    getJsonData(url) {
      axios.get(url).then((response) => {
        this.name = response.data.name;
      });
    },
  },
};
</script>
