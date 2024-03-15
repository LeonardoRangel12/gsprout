<template>
  <div class="bg-white dark:bg-gray-900">
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
              Bienvenido
            </h2>
            <p class="mt-3 text-gray-500 dark:text-gray-300">
              Conecta tu wallet para continuar
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
                  >Usuario</label
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
                  >Contraseña</label
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
                  class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  Iniciar sesión
                </button>
              </div>
            </form>
          </div>
          <p class="mt-6 text-sm text-center text-gray-400">
            ¿No tienes una cuenta?
            <a
              href="#"
              class="text-blue-500 focus:outline-none focus:underline hover:underline"
              @click="switchToRegister"
              >Registrate</a
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

const { connected, disconnect, publicKey } = useWallet();
disconnect();

const router = useRouter(); // Obtener el enrutador de Vue
// console.log(router);

const formData = ref({
  username: "",
  password: "",
  publicKey: "",
});

// const loading = ref(false);
// if (router.currentRoute.value.query.registered) {
//   alert("Usuario registrado correctamente");
// }
// watch(connected, async (value) => {
//   if (value) {
//     await axios.get("")
//   }
// });

const getUser = async () => {
  try {
    const res = await axios.post("/usuarios/login", {
      username: formData.value.username,
      password: formData.value.password,
      publicKey: publicKey.value.toBase58(),
    });
    return res;
  } catch (error) {
    return error.response;
  }
};

const login = async () => {
  const res = await getUser();
    if (res.status === 401 || res.status === 404){
      alert("Usuario y/o contraseña incorrectos. Por favor, inténtalo de nuevo.");
      return;
    }

  localStorage.setItem("token", res.data.token);
  router.push("/main");
};
// const login = async () => {
//   if (
//     !formData.value.email ||
//     !formData.value.username ||
//     !formData.value.password
//   ) {
//     console.warn("Por favor, completa todos los campos del formulario.");
//     return;
//   }
//   try {
//     loading.value = true; // Mostrar el círculo de carga
//     const response = await axios.post("/usuarios/login", {
//       email: formData.value.email,
//       username: formData.value.username,
//       password: formData.value.password,
//     });
//     // Si la respuesta es exitosa (código 200), redirige al usuario
//     if (response.status === 200) {
//       // JWT
//       localStorage.setItem("token", response.data.token); // Guardar el token en el almacenamiento local
//       // Redireccionar al usuario a la página deseada después del inicio de sesión
//       router.push("/main"); // Cambia '/dashboard' a la ruta que desees
//     }
//     loading.value = false; // Ocultar el círculo de carga después de recibir una respuesta
//   } catch (error) {
//     console.error("Hubo un error en la solicitud:", error);
//     loading.value = false; // Ocultar el círculo de carga en caso de error
//   }
// };

const switchToRegister = () => {
  // Redirige al usuario a la página de registro
  router.push("/register");
};
</script>
<style>
.border-blue-400 {
  border-color: transparent;
}
</style>
