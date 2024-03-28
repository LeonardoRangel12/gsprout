<template>
  <div class="dark:bg-gray-900">
    <Navbar />
    <div class="container mx-auto py-8 grid grid-cols-1 sm:grid-cols-12 gap-6 px-4">
      <!-- Columna de Perfil de Usuario -->
      <div class="col-span-12 sm:col-span-3">
        <div class="bg-gray-800 rounded-lg p-6 shadow-lg">
          <div class="flex flex-col items-center">
            <img :src="user.avatar" class="w-32 h-32 bg-gray-300 rounded-full mb-4 shadow-md" />
            <h1 class="text-2xl font-bold text-white">{{ user.username }}</h1>
            <h2 class="text-sm text-gray-400">{{ user.nombre }}</h2>
            <div class="mt-2 text-sm text-gray-400">Nivel {{ user.nivel }}</div>
            <div class="mt-4 flex justify-center">
              <button @click="addFriend" class="bg-indigo-600 hover:bg-blue-600 text-white py-2 px-6 rounded">Editar</button>
            </div>
          </div>
          <hr class="my-6 border-t border-gray-600">
          <div class="text-white">
            <div class="flex justify-between mb-2">
              <div class="text-gray-400">Juego Favorito:</div>
              <div class="font-semibold">{{ user.juegoFavorito }}</div>
            </div>
            <div class="flex justify-between mb-2">
              <div class="text-gray-400">Horas de Juego:</div>
              <div class="font-semibold">{{ user.horas_juego }}</div>
            </div>
            <div class="flex justify-between mb-2">
              <div class="text-gray-400">Logros Desbloqueados:</div>
              <div class="font-semibold">{{ user.logros }}</div>
            </div>
            <button @click="openModal" class="text-indigo-500 hover:underline cursor-pointer">Editar Descripción</button>
          </div>
        </div>
      </div>
      <!-- Columna de Contenido Principal -->
      <div class="col-span-12 sm:col-span-9">
        <!-- Sobre mí -->
        <div class="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
          <h2 class="text-2xl font-bold mb-4 text-white">Sobre mí</h2>
          <p class="text-gray-400">{{ user.descripcion }}</p>
        </div>
        <!-- Juegos Recientes -->
        <div class="mt-6">
          <h2 class="text-xl font-bold mb-4 text-white">Juegos Recientes</h2>
          <div class="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div class="flex overflow-x-auto">
              <div v-for="game in recentGames" :key="game.id" class="flex-shrink-0 w-24">
                <div class="flex flex-col items-center">
                  <img :src="game.imagen" class="w-16 h-16 bg-gray-300 rounded-full mb-2 shadow-md" />
                  <div class="text-xs text-gray-400">{{ game.nombre }}</div>
                  <div class="text-xs text-gray-400">{{ game.descripcion }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Amigos -->
        <div class="mt-6">
          <h2 class="text-xl font-bold mb-4 text-white">Amigos</h2>
          <div class="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div class="flex overflow-x-auto">
              <div v-for="friend in friendsWithUsernameAndName" :key="friend.id" class="flex-shrink-0 w-24">
                <div class="flex flex-col items-center">
                  <img :src="user.avatar" class="w-16 h-16 bg-gray-300 rounded-full mb-2 shadow-md" />
                  <div class="text-xs text-gray-400">{{ friend.username }}</div>
                  <div class="text-xs text-gray-400">{{ friend.nombre }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    <!-- Modal de Edición de Descripción -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded-lg">
        <h2 class="text-xl font-bold mb-4">Editar Descripción</h2>
        <textarea v-model="newDescription" class="w-full h-24 bg-gray-100 text-gray-700 p-2 mb-4"></textarea>
        <div class="flex justify-end">
          <button @click="closeModal" class="text-gray-600 hover:text-gray-800 mr-4">Cancelar</button>
          <button @click="updateDescription" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">Guardar Cambios</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './navbarComponent.vue';
import Footer from './FooterComponent.vue';
import axios from '../main';

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
        avatar: 'https://randomuser.me/api/portraits/men/94.jpg',
        nivel: 15,
        juegoFavorito: 'Jesucristo',
        logros: 150
      },
      friends: [],
      recentGames: [],
      showModal: false,
      newDescription: '',
    }
  },
  async created() {
    await this.getUser();
    await this.getFriends();
    await this.getRecentGames();
  },
  methods: {
    async getUser() {
      try {
        const response = await axios.get('/usuarios/me');
        this.user.username = response.data.username;
        this.user.nombre = response.data.nombre;
        this.user.descripcion = response.data.descripcion;
        this.user.horas_juego = response.data.horas_juego;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$router.push('/');
        } else {
          console.error(error);
        }
      }
    },
    async getFriends() {
      try {
        const response = await axios.get('/usuarios');
        this.friends = response.data.filter(user => user.nombre && user.username).slice(0, 8);
      } catch (error) {
        console.error(error);
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
        this.user.descripcion = this.newDescription;
        const request = await axios.put('usuarios/',{
            descripcion: this.newDescription
        });
        if(request.status == 200){
          console.log("Usuario actualizado");
        }
        this.closeModal();
      } catch (error) {
        console.error(error);
      }
    },
    async getRecentGames() {
      try {
        const response = await axios.get('/juegos');
        this.recentGames = response.data.slice(0, 8);
      } catch (error) {
        console.error('Error al obtener los juegos recientes:', error);
      }
    },
    addFriend() {
      // Lógica para agregar amigo
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
