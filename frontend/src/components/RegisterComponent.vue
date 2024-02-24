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
            <h2 class="text-4xl font-bold text-center text-gray-700 dark:text-white">Registro</h2>
            <p class="mt-3 text-gray-500 dark:text-gray-300">Ingresa tus datos para crear una cuenta</p>  
          </div>

          <div class="mt-8">
            <form @submit.prevent="register">
              <div>
                <label for="email" class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Correo</label>
                <input type="email" name="email" id="email" v-model="formData.email" placeholder="Correo electrónico" class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
              </div>

              <div class="mt-6">
                <label for="username" class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Usuario</label>
                <input type="text" name="username" id="username" v-model="formData.username" placeholder="Nombre de usuario" class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
              </div>
              
              <div class="mt-6">
                <label for="password" class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Contraseña</label>
                <input type="password" name="password" id="password" v-model="formData.password" placeholder="*****" class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
              </div>

              <div class="mt-6">
                <button type="submit" class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">Regístrate</button>
              </div>
            </form>

            <p class="mt-6 text-sm text-center text-gray-400">¿Ya tienes una cuenta? <a href="#" class="text-blue-500 focus:outline-none focus:underline hover:underline" @click="switchToLogin">Inicia sesión</a>.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const formData = ref({
      email: '',
      username: '', 
      password: ''
    });
    const router = useRouter();

    const register = async function() {
        if (!formData.value.email || !formData.value.username || !formData.value.password) {
            console.warn('Por favor, completa todos los campos del formulario.');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/usuarios/', { // Se define la creacion de usuario. Las contraseñas 
                email: formData.value.email,
                username: formData.value.username,
                password: formData.value.password
            });
            console.log(response); // Aquí puedes manejar la respuesta del servidor
        } catch (error) {
            console.error('Hubo un error en la solicitud:', error);
        }
    };

    const switchToLogin = () => {
        router.push('/'); // Redirige al usuario a la página de inicio de sesión
    };

    return { formData, register, switchToLogin }
  }
}
</script>
