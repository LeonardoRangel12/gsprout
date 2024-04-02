<template>
  <Navbar />
  <section class="bg-gray-900 text-white px-4 py-8 md:px-8">
    <div class="max-w-screen-xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- User Profile Card -->
        <div class="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
          <div class="flex flex-col items-center justify-center">
            <img :src="user.avatar" class="rounded-full h-32 w-32 mb-4" alt="User Avatar" />
            <h3 class="text-xl font-semibold mb-2">{{ user.username }}</h3>
            <p>{{ user.descripcion }}</p>
          </div>
          <div class="mt-6 flex justify-between">
            <div>
              <p>Level</p>
              <p class="font-semibold">{{ user.nivel }}</p>
            </div>
            <div>
              <p>Friends</p>
              <p class="font-semibold">{{ user.countFriend }}</p>
            </div>
            <div>
              <p>Game Time</p>
              <p class="font-semibold">{{ user.horas_juego }} hrs</p>
            </div>
          </div>
        </div>

        <!-- Search and Add Friend -->
        <div class="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
          <h3 class="text-lg font-semibold mb-4">Find Friends</h3>
          <input v-model="searchUser" type="text" class="w-full px-4 py-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4" placeholder="Search User" />
          <button @click="SearchUser(searchUser)" class="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700">Search</button>
          <div v-if="userFound" class="mt-4">
            <p class="mb-2">Add {{ userSearched }} as Friend?</p>
            <button @click="AddFriend(userSearched)" class="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700">Add Friend</button>
          </div>
        </div>

        <!-- Friends List -->
        <div class="bg-gray-800 rounded-lg shadow-xl p-6 mb-8">
          <h3 class="text-lg font-semibold mb-4">Friends List</h3>
          <div v-if="friends.length === 0" class="text-gray-400 text-center">You have no friends yet.</div>
          <div v-else>
            <div v-for="friend in friends" :key="friend" class="flex items-center justify-between py-2 border-b border-gray-700">
              <p>{{ friend }}</p>
              <button @click="removeFriend(friend)" class="text-red-500 hover:text-red-700"><i class="fas fa-trash-alt"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Description Modal -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div class="bg-gray-800 w-full md:w-1/2 p-6 rounded-lg">
        <h3 class="text-xl font-semibold mb-4">Edit Description</h3>
        <textarea v-model="newDescription" class="w-full h-32 px-4 py-2 rounded-md bg-gray-700 text-white mb-4" placeholder="Enter your new description..."></textarea>
        <div class="flex justify-end">
          <button @click="closeModal" class="text-gray-300 hover:text-gray-400 mr-4">Cancel</button>
          <button @click="updateDescription" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">Save Changes</button>
        </div>
      </div>
    </div>
    <!-- /Edit Description Modal -->

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
    async openModal() {
      this.showModal = true;
      this.newDescription = this.user.descripcion;
    },
    async closeModal() {
      this.showModal = false;
    },
    async updateDescription() {
      try {
        const response = await axios.put('usuarios/', {
          descripcion: this.newDescription
        });
        if (response.status === 200) {
          this.user.descripcion = this.newDescription;
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Description updated successfully',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error updating description',
          });
        }
        this.closeModal();
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
        let friend = name;
        if (!this.friends.includes(friend)) {
          this.friends.push(friend);
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
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'This user is already in your friends list.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Error adding friend. Please try again.",
        });
      }
    },
    async removeFriend(friend) {
      try {
        const index = this.friends.indexOf(friend);
        if (index > -1) {
          this.friends.splice(index, 1);
          const request = await axios.put("usuarios/", {
            countFriends: this.friends.length,
            friends: this.friends
          });
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Friend removed successfully.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Error removing friend. Please try again.",
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
