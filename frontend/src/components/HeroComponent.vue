<template>
  <div class="bg-gray-900">
    <div class="bg-gradient-to-b from-violet-600/[.7] via-transparent">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-32 space-y-8 relative">
        <!-- Fondo de la imagen -->
        <div class="absolute inset-0 z-1">
          <img src="https://dlcdnwebimgs.asus.com/files/media/92A296C4-BA56-40C2-A462-AE2729261A0B/main/v1/images/large/1x/bg_armoury_crate_1.jpg" alt="Imagen de fondo" class="object-cover w-full h-full" />
        </div>
        <!-- Fin del fondo de la imagen -->
        <!-- Contenido del hero -->
        <div class="relative z-0 text-center text-white">
          <!-- Título -->
          <div class="max-w-3xl mx-auto">
            <h1 class="block font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight">
                Welcome to G'Sprout <span v-if="username" class="text-blue-500">{{ username }}</span>
            </h1>
          </div>
          <!-- Fin de Título -->
          <!-- Subtítulo -->
          <div class="max-w-3xl mx-auto">
            <p class="text-lg font-medium">{{ dynamicPhrase }}</p>
          </div>
          <!-- Fin de Subtítulo -->
        </div>
        <!-- Fin del contenido del hero -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const username = ref(''); // Inicializamos el nombre de usuario como una referencia reactiva
const actions = ["Compra", "Subasta", "Vende", "Presta", "Renta", "Cambia"];
const dynamicPhrase = ref('');

onMounted(() => {
  // Cambiar la frase cada segundo
  setInterval(() => {
    const action = actions[Math.floor(Math.random() * actions.length)];
    dynamicPhrase.value = `${action} juegos`;
  }, 1000);
});
</script>

<style>
/* Estilos para el subtítulo */
.text-lg {
  font-size: 1.5rem; /* Tamaño del texto */
  line-height: 1.75; /* Espaciado entre líneas */
}
</style>
