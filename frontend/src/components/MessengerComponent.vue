<template>
    <Navbar/>
    <section class="flex h-screen">
      <!-- Lista de usuarios -->
      <div class="w-1/4 p-4 bg-gray-900 text-white">
        <h2 class="text-lg font-bold mb-4">Usuarios</h2>
        <input v-model="searchQuery" type="text" placeholder="Buscar usuario..." class="w-full p-2 mb-4 rounded-md bg-gray-800 text-white">
        <ul>
          <li v-for="(user, index) in filteredUsers" :key="index" class="cursor-pointer mb-2" @click="selectUser(user)">
            {{ user }}
          </li>
        </ul>
      </div>
  
      <!-- Lista de mensajes -->
      <div class="w-3/4 p-4 bg-gray-800 text-white">
        <h2 class="text-lg font-bold mb-4">Chat con {{ selectedUser }}</h2>
        <div v-if="selectedUser">
          <div v-for="(message, index) in messages" :key="index" class="mb-2">
            <div :class="message.from === selectedUser ? 'text-right' : 'text-left'">
              <span class="inline-block bg-gray-700 px-3 py-1 rounded-lg">{{ message.content }}</span>
            </div>
          </div>
          <input v-model="newMessage" type="text" placeholder="Escribe un mensaje..." class="w-full p-2 mt-4 rounded-md bg-gray-700 text-white">
          <button @click="sendMessage" class="bg-blue-500 text-white py-2 px-4 mt-2 rounded-md">Enviar</button>
        </div>
        <div v-else>
          <p>Selecciona un usuario para empezar a chatear.</p>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  
import Discord from './DiscordComponent.vue';
import { ref } from "vue";
import Navbar from "./navbarComponent.vue";
import Footer from "./FooterComponent.vue";
import Hero from "./HeroComponent.vue";
import NewGames from "./NewGamesComponent.vue";
import axios from "../main";
import Swal from "sweetalert2"; // Importa SweetAlert

  export default {
    components: {
    Navbar,
    Footer,
    Hero,
    NewGames,
    Discord,
  },
    data() {
      return {
        users: [], // Lista de usuarios
        searchQuery: "", // Query de búsqueda
        selectedUser: null, // Usuario seleccionado
        messages: [], // Lista de mensajes
        newMessage: "", // Nuevo mensaje a enviar
      };
    },
    async setup(){
      const users = ref([]);
      const res = await axios.get("/chat");
      if(res.status === 200) {
        users.value = res.data;
      } else {
        // Error al cargar los usuarios
        console.error("Error al cargar los usuarios");
      }
      console.log(users.value);
      return { users };
    },
    computed: {
      filteredUsers() {
        const search =  this.users.filter(user =>
          user.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        return search;
      }
    },
    methods: {
      async selectUser(user) {
        this.selectedUser = user;
        // Simular carga de mensajes (esto podría venir de una API)
        const res = await axios.get(`/chat/${this.selectedUser}`);
        if(res.status === 200) {
          for(let message in res.data){
            if(message.from === localStorage.getItem("username")){
              message.from = "Tú";
            }
          }
          this.messages = res.data;
        } else {
          // Error al cargar los mensajes
          console.error("Error al cargar los mensajes");
        }
      },
      async sendMessage() {
        // Aquí puedes implementar la lógica para enviar mensajes
        if (this.newMessage.trim() !== "") {
          const res = await axios.post("/chat", {
            from: localStorage.getItem("username"),
            to: this.selectedUser,
            content: this.newMessage
          });
          if(res.status === 200 || res.status === 201) {
            // Mensaje enviado correctamente
            this.messages.push({ from: "Tú", content: this.newMessage });
            console.log("Mensaje enviado");
          } 
        

          else {
            // Error al enviar el mensaje
            console.error("Error al enviar el mensaje");
          }
          this.newMessage = ""; // Limpiar el campo de texto después de enviar el mensaje
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos CSS personalizados con tema oscuro */
  input[type="text"], button {
    border: none;
    outline: none;
  }
  
  body {
    background-color: #1a1a1a;
  }
  
  </style>
  