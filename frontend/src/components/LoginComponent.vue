<template>
  <div class="bg-white dark:bg-gray-950">
    <div class="flex justify-center h-screen">
      <div
        class="hidden bg-cover lg:block lg:w-2/3"
        style="background-image: url(https://i.imgur.com/kTmAFF5.jpg)"
      >
        <div class="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
          <div></div>
        </div>
      </div>

      <div class="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
        <div class="flex-1">
          <div class="text-center">
            <h2
              class="text-4xl font-bold text-center text-gray-700 dark:text-white"
            >
              Welcome
            </h2>
            <p class="mt-3 text-gray-500 dark:text-gray-300">
              Connect your wallet to continue
            </p>
          </div>

          <div class="mt-8 flex justify-center">
            <wallet-multi-button class="flex center"></wallet-multi-button>
          </div>
          <div class="mt-8" v-show="connected">
            <form @submit.prevent="login">
              <!-- <div>
                <label for="nombre" class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Nombre Completo</label>
                <input type="text" name="nombre" id="nombre" v-model="formData.nombre" placeholder="Nombre Completo" class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40" />
              </div> -->

              <div class="mt-6">
                <label
                  for="username"
                  class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >Username</label
                >
                <input
                  type="text"
                  name="username"
                  id="username"
                  v-model="formData.username"
                  placeholder="Nombre de usuario"
                  class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>
              <!-- <div class="mt-6">
                <label
                  for="email"
                  class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >Correo</label
                >
                <input
                  type="email"
                  name="email"
                  id="email"
                  v-model="formData.email"
                  placeholder="Correo electrónico"
                  class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div> -->

              <div class="mt-6">
                <label
                  for="password"
                  class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >Password</label
                >
                <input
                  type="password"
                  name="password"
                  id="password"
                  v-model="formData.password"
                  placeholder="*****"
                  class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
                <input
                  type="hidden"
                  name="wallets"
                  v-model="formData.wallets"
                  value="publicKey"
                />
              </div>

              <div class="mt-6">
                <button
                  type="submit"
                  class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-800 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  Log in
                </button>
              </div>
            </form>
          </div>
          <p class="mt-6 text-sm text-center text-gray-400">
            Don't have an account?
            <a
              href="#"
              class="text-blue-500 focus:outline-none focus:underline hover:underline"
              @click="switchToRegister"
              >Register</a
            >.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "../main";
import { WalletMultiButton, useWallet } from "solana-wallets-vue";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
const { connected, disconnect, publicKey } = useWallet();
disconnect();
const router = useRouter(); // Obtener el enrutador de Vue
const params = router.currentRoute.value;
const formData = ref({
  username: "",
  password: "",
  publicKey: "",
});
if(params.query.dir != null){
  if(!params.query.success){
    switch(params.query.dir){
      case 'solanaPay':
        Swal.fire({
          icon: 'info',
          title: 'Information',
          text: 'You need first to log in to buy'
        });
      break;
    }
  }
}
const validateForm = () => {
  if (!formData.value.username) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor, introduce tu nombre de usuario.',
    });
    return false;
  }
  if (!formData.value.password) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Por favor, introduce tu contraseña.',
    });
    return false;
  }
  return true;
};

const getUser = async () => {
  try {
    const res = await axios.post("/usuarios/login", {
      username: formData.value.username,
      password: formData.value.password,
      publicKey: publicKey.value.toBase58(),
    });
    if(res.status === 200) {
      return res.data;
    }
    else if(res.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Password incorrect. Please try again.',
      });
    }
    else if(res.status === 500) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Internal server error. Please try again later.',
      });
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred. Please try again later.',
      });
    }
    return;
  } catch (error) {
    if(error.response.status === 404) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Username not found. Please try again.',
      });
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'An error occurred. Please try again later.',
      });
    }
      return;
  }
};

const login = async () => {
  if (!validateForm()) return;
  const userData = await getUser();
  if(!userData) return;
  localStorage.setItem("username", userData.username);
  localStorage.setItem("token", "Bearer " + userData.token);
  if(params != null){
    switch(params.query.dir){
      case 'solanaPay':
        router.push('/'+params.query.dir+"?id="+params.query.id);
      break;
      default:
        router.push("/");
      break;
    }
  }
};
const switchToRegister = () => {
  if(params.query.dir != null){
    switch(params.query.dir){
      case 'solanaPay':
        router.push("/register?dir="+params.query.dir+"&id="+params.query.id);
      break;
    }
  }
  else{
    router.push("/register");
  }
};
</script>


<style>
.border-blue-400 {
  border-color: transparent;
}
</style>
