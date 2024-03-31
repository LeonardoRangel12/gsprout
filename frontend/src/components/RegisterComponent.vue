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
              Register
            </h2>
            <p class="mt-3 text-gray-500 dark:text-gray-300">
              Enter your information to create an account
            </p>
          </div>

          <div class="mt-8">
            <div class="mt-8 flex justify-center">
              <wallet-multi-button></wallet-multi-button>
            </div>
            <form @submit.prevent="register">
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
              <div class="mt-6">
                <label
                  for="email"
                  class="block mb-2 text-sm text-gray-600 dark:text-gray-200"
                  >Email</label
                >
                <input
                  type="email"
                  name="email"
                  id="email"
                  v-model="formData.email"
                  placeholder="Correo electrónico"
                  class="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                />
              </div>

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
                <input type="hidden" name="wallets" v-model="formData.wallets" value="publicKey"/>
              </div>

              <div class="mt-6">
                <button
                  type="submit"
                  id="registerButton"
                  class="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-indigo-800 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                >
                  Regíster
                </button>
              </div>
              <div v-if="errorMessages.length > 0 " class="block w-full px-4 py-2 mt-2 text-center text-red-600 bg-red-100">
                <p v-for="error in errorMessages" :key="error">{{ error }}</p>
              </div>
              <div v-if="userRegistered" class="block w-full px-4 py-2 mt-2 text-green-600 bg-green-300 text-center">
                <p>Successfully registered user</p>
                <p>You will be redirected to the login page shortly</p>
                <P>
                  <a 
                    href="#" 
                    class="font-bold focus: outline-none focus:underline hover:underline" 
                    @click="switchToLogin">
                    Speed up the process by clicking on this message!
                  </a>
                  {{ switchToLoginWithTimer() }}
                </P>
              </div>
            </form>
            <p class="mt-6 text-sm text-center text-gray-400">
                Already have an account?
              <a
                href="#"
                class="text-blue-500 focus:outline-none focus:underline hover:underline"
                @click="switchToLogin"
                >Log in</a
              >.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import newAxios from "../main";
import { useRouter } from "vue-router";
import { WalletMultiButton, useWallet } from "solana-wallets-vue";
import Swal from "sweetalert2";

export default {
  components: {
    WalletMultiButton,
  },
  setup() {
    useRouter();
    const formData = reactive({
      email: "",
      username: "",
      password: "",
      wallets: null,
    });
    const errorMessages = ref([]);
    const userRegistered = ref(false);
    return {
      formData,
      errorMessages,
      userRegistered,
    };
  },
  methods: {
    async register() {
      this.errorMessages = [];
      const { publicKey } = useWallet();
      let button = document.getElementById("registerButton");
      button.disabled = true;
      button.style.cursor = "wait";
      try {
        const { connected } = useWallet();
        if (connected.value === false) {
          this.errorMessages.push("Conecta tu wallet para continuar");
          return;
        }
        if (
          !this.formData.email ||
          !this.formData.username ||
          !this.formData.password
        ) {
          this.errorMessages.push(
            "Por favor, completa todos los campos del formulario."
          );
          return;
        }
        if (this.formData.password.length < 8) {
          this.errorMessages.push(
            "La contraseña debe tener al menos 8 caracteres"
          );
          return;
        }
        if (!RegExp(/\S+@\S+\.\S+/).test(this.formData.email)) {
          this.errorMessages.push("El correo no es válido");
          return;
        }
        try {
          const response = await newAxios.post("/usuarios/", {
            email: this.formData.email,
            username: this.formData.username,
            password: this.formData.password,
            wallets: [publicKey.value.toBase58()],
          });
          if (response.status == 201) {
            // Validating user registration
            this.userRegistered = true;
            Swal.fire({
              icon: "success",
              title: "Registro exitoso",
              text: "¡Usuario registrado correctamente!",
            });
          }
        } catch (error) {
          // Catch the error of user already exists
          if (error.response.status === 400) {
            this.errorMessages.push("El usuario ya existe");
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "El usuario ya existe",
            });
          }
        }
      } catch (error) {
        // Several error handling for different status codes
        if (error.response.status === 500) {
          this.errorMessages.push("Internal server error:", error);
        } else if (error.response.status === 400) {
          this.errorMessages.push("Hubo un error en la solicitud:", error);
        } else {
          this.errorMessages.push("Error:", error);
        }
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un error en la solicitud",
        });
      } finally {
        setTimeout(() => {
          button.disabled = false;
          button.style.cursor = "pointer";
        }, 1000);
      }
    },
    switchToLogin() {
      this.$router.push("/");
    },
    switchToLoginWithTimer() {
      setTimeout(() => {
        this.switchToLogin();
      }, 5000);
    },
  },
};
</script>
