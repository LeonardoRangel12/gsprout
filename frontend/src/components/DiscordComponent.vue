<template>
  <div class="flex justify-center items-center h-full bg-gray-950 ">
    <img :src="imagenUrl" alt="Steam Logo" class="max-w-full max-h-full">
  </div>
</template>

<script>
export default {
  data() {
    return {
      imagenUrl: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/clans/34080519/4561c53320d23df0163990d5bc3525d93f2858cf.png'
    };
  }
};
</script>

<style scoped>
/* Estilos específicos para este componente van aquí */
</style>
