<template>
    <div class="bg-gray-900">
        <div class="bg-gradient-to-b from-violet-600/[.15] via-transparent">
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
                            Bienvenido a la tienda <span v-if="username" class="text-blue-500">{{ username }}</span>
                        </h1>
                    </div>
                    <!-- Fin de Título -->

                    <div class="max-w-3xl text-center mx-auto">
                        <p class="text-lg text-gray-400">¡Explora un mundo de juegos con nuestra vasta colección!</p>
                    </div>

                    <!-- Botones -->
                    <div class="text-center">
                        <a class="inline-flex justify-center items-center gap-x-3 text-center bg-gradient-to-tl from-blue-600 to-violet-600 shadow-lg shadow-transparent hover:shadow-blue-700/50 border border-transparent text-white text-sm font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-white py-3 px-6 dark:focus:ring-offset-gray-800"
                            href="#">
                            <span>Comprar ahora</span>
                            <svg class="flex-shrink-0 w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </a>
                    </div>
                    <!-- Fin de Botones -->
                </div>
                <!-- Fin del contenido del hero -->
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from '../main';
import { ref, onMounted } from 'vue';

const username = ref(''); // Inicializamos el nombre de usuario como una referencia reactiva

onMounted(async () => {
    try {
        // Aquí obtienes la cookie guardada
        const savedCookie = document.cookie;

        // Luego, puedes incluir la cookie en la solicitud al backend
        const response = await axios.get('/usuarios/me', {
    withCredentials: true
});


        // Actualizas el valor de la referencia username con el nombre de usuario obtenido del backend
        username.value = response.data.username;
    } catch (error) {
        console.error('Error al obtener el nombre de usuario:', error);
    }
});
</script>
