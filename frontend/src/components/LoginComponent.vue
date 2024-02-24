<template>
    <div class="bg-white dark:bg-gray-900">
      <div class="flex justify-center h-screen">
        <div 
          class="hidden bg-cover lg:block lg:w-2/3"
          style="background-image:url(https://i.imgur.com/kTmAFF5.jpg)"
        >
          <div class="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
             <div>
  
             </div>
          </div>
        </div>
  
        <div class="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div class="flex-1">
            <div class="text-center">
              <h2 class="text-4xl font-bold text-center text-gray-700 dark:text-white">
                {{ isLogin ? 'Bienvenido' : 'Registro' }} 
              </h2>
  
              <p class="mt-3 text-gray-500 dark:text-gray-300">
                {{ isLogin ? 'Ingresa tus datos para iniciar sesión' : 'Ingresa tus datos para registrarte' }}
              </p>
            </div>
  
            <div class="mt-8">
              <form @submit.prevent="submit">
  
                <div v-if="!isLogin">
                  <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                    Usuario
                  </label>
                  
                  <input
                    v-model="formData.nombre"
                    type="text"
                    class="block w-full input"
                    placeholder="Usuario"
                  >
                </div>
  
                <div>
                  <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                    Email 
                  </label>
                  
                  <input
                    v-model="formData.email"
                    type="email" 
                    class="block w-full input"
                    placeholder="correo@correo.com"
                  >
                </div>
  
                <div>
                  <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">
                    Contraseña
                  </label>
                  
                  <input
                    v-model="formData.password"
                    type="password"
                    class="block w-full input" 
                    placeholder="*****"
                  >
                </div>
  
                <div class="mt-6">
                  <button
                    class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    {{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}
                  </button>
                </div>
  
              </form>
  
              <p class="mt-6 text-sm text-center text-gray-400">
                {{ isLogin ? 'No tienes cuenta?' : 'Ya tienes cuenta?' }}  
  
                <a
                  href="#"
                  class="text-blue-500 focus:outline-none focus:underline hover:underline" 
                  @click="switchAuthMode"
                >
                  {{ isLogin ? 'Regístrate' : 'Inicia Sesión' }}
                </a>
              </p>
  
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const isLogin = ref(true);
  
      const switchAuthMode = () => {
        isLogin.value = !isLogin.value;
      };
  
      const formData = ref({    
        nombre: '',
        email: '',
        password: '',
      });
      
      const submit = () => {
        if (isLogin.value) {
          // Logica para iniciar sesión
        } else {
          // Logica para registrar usuario  
        }
      };
  
      return {
        isLogin,
        formData,
        submit,
        switchAuthMode, 
      };
    },  
  };
  </script>
  
  <style>
  .input {
    @apply block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40; 
  }
  </style>