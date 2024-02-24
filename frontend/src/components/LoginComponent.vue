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
                                <label for="usuarioCorreo"
                                    class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Usuario o Correo</label>
                                <input type="text" name="usuarioCorreo" id="usuarioCorreo" v-model="formData.usuarioCorreo"
                                    placeholder="Nombre de usuario o Correo electrónico"
                                    class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                            </div>

                            <div class="mt-6">
                                <label for="contrasena"
                                    class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Contraseña</label>
                                <input type="password" name="contrasena" id="contrasena" v-model="formData.contrasena"
                                    placeholder="*****"
                                    class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
                            </div>

                            <div class="mt-6">
                                <button
                                    class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                                    Inicia sesión
                                </button>
                            </div>

                        </form>

                        <p class="mt-6 text-sm text-center text-gray-400">No tienes una cuenta aún? <a href="#"
                                class="text-blue-500 focus:outline-none focus:underline hover:underline"
                                @click="switchToRegister">Regístrate</a>.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const formData = ref({
    usuarioCorreo: '',
    contrasena: ''
});

const login = () => {
    if (!formData.value.usuarioCorreo || !formData.value.contrasena) {
        console.warn('Por favor, completa todos los campos del formulario.');
        return;
    }

    // Aquí puedes agregar tu lógica de inicio de sesión
};

const switchToRegister = () => {
    // Aquí puedes agregar la lógica para cambiar al componente de registro
};
</script>


