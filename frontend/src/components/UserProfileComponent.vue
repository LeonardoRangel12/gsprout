<template>
  <Navbar />
  <section class="flex flex-row items-center bg-gray-950">
    <div class="container mx-auto px-4">
      <div class="relative flex flex-col min-w-0 break-words bg-gray-900 w-full mb-6 shadow-xl rounded-lg mt-20">
        <div class="px-6">
          <div class="flex flex-wrap justify-center">
            <div class="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
              <div class="py-6 px-3 mt-32 sm:mt-0">
                <input type="text" v-model="searchUser" class="m-1"/><button @click="SearchUser(searchUser)" class="bg-indigo-800 active:bg-indigo-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
                  Search
                </button>
                <div v-if="userFound">
                  <button id="AddUser" @click="AddFriend(userSearched)">{{ userSearched}}</button>
                </div>
              </div>
            </div>
            <div class="w-full lg:w-4/12 px-4 lg:order-1">
              <div class="flex justify-center py-4 lg:pt-4 pt-8">
                <div class="mr-4 p-3 text-center">
                  <span class="text-xl font-bold block uppercase tracking-wide text-gray-300">{{ user.countFriend }}</span><span class="text-sm text-gray-400">Friends</span>
                </div>
              </div>
            </div>
            <div class="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
              <div class="flex justify-self-end m-auto">
                <img :src="user.avatar" class="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16" style="max-width:150px;"/>
              </div>
            </div>
          </div>
          <div class="text-center mt-12">
            <h3 class="text-4xl font-semibold leading-normal text-gray-200 mb-2">
              {{ user.username }}
            </h3>
            <div class="text-sm leading-normal mt-0 mb-2 text-gray-300 font-bold uppercase">
              <i class="fas fa-map-marker-alt mr-2 text-lg text-gray-300"></i>
              Level: {{ user.nivel }}
            </div>
            <!-- Modal de Edición de Descripción -->
            <div v-if="showModal" class="flex inset-0 items-center justify-center bg-gray-950 bg-opacity-10">
              <div class="bg-white p-6 rounded-lg">
                <h2 class="text-xl font-bold mb-4">Edit Description</h2>
                <textarea v-model="newDescription" class="w-full h-24 bg-gray-100 text-gray-700 p-2 mb-4"></textarea>
                <div class="flex justify-end">
                  <button @click="closeModal" class="text-gray-600 hover:text-gray-800 mr-4">Cancel</button>
                  <button @click="updateDescription" id="updateDescription" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">Save Changes</button>
                </div>
              </div>
            </div>
            <button @click="openModal" class="text-xl text-indigo-500 hover:underline cursor-pointer">Edit Description</button>
          </div>
          <div class="mt-10 py-10 border-t border-gray-200 text-center">
            <div class="flex flex-wrap justify-center">
              <div class="w-full lg:w-9/12 px-4">
                <p class="mb-4 text-lg font-bold leading-relaxed text-gray-300">
                  Description
                </p>
                <p class="mb-4 text-lg leading-relaxed text-gray-300">
                  {{ user.descripcion }}
                </p>
              </div>
            </div>
          </div>
          <!-- Lista de amigos -->
          <div class="text-center mt-12">
            <h3 class="text-4xl font-semibold leading-normal text-gray-200 mb-2">
              Amigos
            </h3>
            <div class="flex flex-wrap justify-center">
              <!-- Iterar sobre la lista de amigos y mostrar cada uno -->
              <div v-for="friend in friends" :key="friend" class="mr-4 p-3 text-center">
                <span class="text-xl font-bold block uppercase tracking-wide text-gray-300">{{ friend }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <Footer />
</template>

<script>
import Navbar from './navbarComponent.vue';
import Footer from './FooterComponent.vue';
import axios from '../main';
import Swal from "sweetalert2";

export default {
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      user: {
        username: '',
        nombre: '',
        descripcion: '',
        horas_juego: 0,
        avatar: 'https://i.pinimg.com/736x/7a/83/b5/7a83b51dff4c6536cf3fbebaabded767.jpg',
        nivel: 15,
        juegoFavorito: 'Jesucristo',
        logros: 150,
        countFriend: 0,
      },
      userSearched: "",
      recentGames: [],
      friends: [],
      showModal: false,
      newDescription: '',
      searchUser: '',
      userFound: false,
    }
  },
  async created() {
    await this.getUser();
  },
  methods: {
    async getUser() {
      try {
        const response = await axios.get('/usuarios/me');
        this.user.username = response.data.username;
        this.user.nombre = response.data.nombre;
        this.user.descripcion = response.data.descripcion == null ? "" : response.data.descripcion;
        this.user.horas_juego = response.data.horas_juego;
        this.user.countFriend = response.data.countFriends == null ? 0 : response.data.countFriends;
        this.friends = response.data.friends == null ? [] : response.data.friends;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$router.push('/');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error loading user data',
          });
        }
      }
    },
    async getUsers() {
      try {
        const response = await axios.get('/usuarios');
        this.users = response.data.filter(user => user.nombre && user.username).slice(0, 8);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error loading users',
        });
      }
    },
    openModal() {
      this.showModal = true;
      this.newDescription = this.user.descripcion;
    },
    closeModal() {
      this.showModal = false;
    },
    async updateDescription() {
      try {
        let button = document.getElementById("updateDescription");
        button.disabled = true;
        button.style.cursor = "wait";
        this.user.descripcion = this.newDescription;
        const request = await axios.put('usuarios/', {
          descripcion: this.newDescription
        });
        if (request.status == 200) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Description updated successfully',
          });
        }
        setTimeout(() => {
          console.log("Descripcion editada con exito");
          button.disabled = false;
          button.style.cursor = "pointer";
          this.closeModal();
        }, 100)
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error updating description',
        });
      }
    },
    async SearchUser(name) {
      try {
        const request = await axios.get('/usuarios/' + name);
        this.userSearched = request.data.username;
        this.userFound = true;
      } catch (error) {
        this.userFound = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'User not found',
        });
      }
    },
    async AddFriend(name) {
  try {
    let button = document.getElementById("AddUser");
    let friend = name; // Tomar el nuevo amigo
    this.friends.push(friend); // Agregar el nuevo amigo al arreglo existente de amigos
    const request = await axios.put("usuarios/", {
      countFriends: this.friends.length,
      friends: this.friends
    });
    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Exitoso',
        text: 'User added to friends list.',
      });
      button.disabled = false;
      button.style.cursor = "pointer";
      this.userFound = false;
    }, 100)
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: "Error adding friend. Please try again.",
    });
  }
}

  },
  computed: {
    friendsWithUsernameAndName() {
      return this.friends.filter(user => user.nombre && user.username);
    }
  }
};
</script>

<style scoped>
/* Estilos personalizados */
</style>
