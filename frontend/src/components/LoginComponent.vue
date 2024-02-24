<template>
    <div class="bg-white dark:bg-gray-900">
        <div class="flex justify-center h-screen">
            <div class="hidden bg-cover lg:block lg:w-2/3" style="background-image:url(https://i.imgur.com/kTmAFF5.jpg)">
                <div class="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
                    <div>
                        
                    </div>
                </div>
            </div>

            <div class="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
                <div class="flex-1">
                    <div class="text-center">
                        <h2 class="text-4xl font-bold text-center text-gray-700 dark:text-white">Bienvenido</h2>
                        <p class="mt-3 text-gray-500 dark:text-gray-300">Ingresa tus datos para iniciar sesión</p>
                    </div>

                    <div class="mt-8">
                        <form @submit.prevent="login">
                            <div>
                                <label for="usuarioCorreo" class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Correo</label>
                                <input type="text" name="usuarioCorreo" id="usuarioCorreo" v-model="formData.email" placeholder="Correo electrónico" class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                            </div>

                            <div class="mt-6">
                                <label for="username" class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Usuario</label>
                                <input type="text" name="username" id="username" v-model="formData.username" placeholder="Nombre de usuario" class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                            </div>

                            <div class="mt-6">
                                <label for="contrasena" class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Contraseña</label>
                                <input type="password" name="contrasena" id="contrasena" v-model="formData.password" placeholder="*****" class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                            </div>

                            <div class="mt-6">
                                <button type="submit" :class="{ 'border-blue-400': loading }" class="relative w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
                                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2.5A1.5 1.5 0 0010.5 1h-2A1.5 1.5 0 007 2.5V4a8 8 0 017.75 7.996L12 20l-4.75-8.004A8 8 0 014 12z"></path>
                                        </svg>
                                    </span>
                                    <span v-else>Inicia sesión</span>
                                </button>
                            </div>
                        </form>

                        <p class="mt-6 text-sm text-center text-gray-400">No tienes una cuenta  aún? <a href="#" class="text-blue-500 focus:outline-none focus:underline hover:underline" @click="switchToRegister">Regístrate</a>.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter(); // Obtener el enrutador de Vue

const formData = ref({
    email: '',
    username: '',
    password: ''
});

const loading = ref(false);

const login = async () => {
    if (!formData.value.email || !formData.value.username || !formData.value.password) {
        console.warn('Por favor, completa todos los campos del formulario.');
        return;
    }

    try {
        loading.value = true; // Mostrar el círculo de carga
        const response = await axios.post('http://localhost:3000/usuarios/login', {
            email: formData.value.email,
            username: formData.value.username,
            password: formData.value.password
        });

        console.log(response); // Aquí puedes manejar la respuesta del servidor

        // Si la respuesta es exitosa (código 200), redirige al usuario
        if (response.status === 200) {
            // Redireccionar al usuario a la página deseada después del inicio de sesión
            router.push('/dashboard'); // Cambia '/dashboard' a la ruta que desees
        }

        loading.value = false; // Ocultar el círculo de carga después de recibir una respuesta
    } catch (error) {
        console.error('Hubo un error en la solicitud:', error);
        loading.value = false; // Ocultar el círculo de carga en caso de error
    }
};

const switchToRegister = () => {
    // Aquí puedes agregar la lógica para cambiar al componente de registro
};
</script>
<style>
.border-blue-400 {
    border-color: transparent;
}
</style>
