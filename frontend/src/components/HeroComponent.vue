<template>
    <div class="bg-gray-900">
        <div class="bg-gradient-to-b from-violet-600/[.7] via-transparent">
            <div class="mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-8 relative">

                <!-- Fondo de la imagen -->
                <div class="absolute inset-0 z-1">
                    <img src="https://i.imgur.com/kTmAFF5.jpg" alt="Imagen de fondo" class="object-cover w-full h-full" />
                </div>
                <!-- Fin del fondo de la imagen -->

                <!-- Contenido del hero -->
                <div class="relative z-0">
                    <!-- Título -->
                    <div class="max-w-3xl text-center mx-auto">
                        <h1 class="block font-medium text-gray-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                            Bienvenido a G'Sprout <span v-if="username" class="text-blue-500">{{ username }}</span>
                        </h1>
                    </div>
                    <!-- Fin de Título -->

                    <div class="max-w-3xl text-center mx-auto">
                        <p class="text-lg text-white">{{ dynamicPhrase }}</p>
                    </div>

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
.text-white {
    font-size: 1.25rem;
    /* Tamaño del texto */
    line-height: 1.5;
    /* Espaciado entre líneas */
}
</style>
  