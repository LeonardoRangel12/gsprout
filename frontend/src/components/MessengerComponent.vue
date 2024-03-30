<template>
    <Navbar/>
    <section class="flex h-[calc(100vh-96px)]">
      <!-- Lista de usuarios -->
      <div class="w-1/4 p-4 bg-gray-900 text-white">
        <h2 class="text-lg font-bold mb-4">Username</h2>
        <input v-model="searchQuery" type="text" placeholder="Buscar usuario..." class="w-full p-2 mb-4 rounded-md bg-gray-800 text-white">
        <ul>
          <li v-for="(user, index) in filteredUsers" v-if="filteredUsers.length > 0" :key="index" class="cursor-pointer mb-2" @click="selectUser(user)">
            {{ user }}
          </li>
          <li v-else>
          <button class = "bg-blue-500 text-white py-2 px-4 mt-2 mb-2 rounded-md" @click="selectUser(searchQuery) ">New chat</button>
            
          </li>
        </ul>
      </div>
  
      <!-- Lista de mensajes -->
      <div class="w-3/4 p-4 bg-gray-800 text-white flex flex-col h-full ">
        <h2 class="text-lg font-bold mb-4">Chat with {{ selectedUser }}</h2>
        <div class="flex-grow overflow-auto custom-scrollbar" ref="messages">
          <div v-if="selectedUser">
            <div v-for="(message, index) in messages" :key="index" class="mb-2">
              <div :class="message.from === selectedUser ? 'text-left' : 'text-right'">
                <span class="inline-block bg-gray-700 px-3 py-1 rounded-lg message-container mr-4">{{ message.content }}</span>
              </div>
            </div>
          </div>
          <div v-else>
            <p>Select a user to start chatting.</p>
          </div>
        </div>
        <div class="flex mt-4">
          <input v-model="newMessage" type="text" placeholder="Escribe un mensaje..." class="w-full p-2 rounded-l-md bg-gray-700 text-white" @keyup.enter="sendMessage">
          <button @click="sendMessage" class="bg-blue-500 text-white py-2 px-4 rounded-r-md">Send</button>
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
        selectedChat: null,
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
        this.messages = []; // Limpiar mensajes al cambiar de chat
        if(this.users.indexOf(user) === -1){
          this.users.unshift(user);
        }
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
          try{
            const res = await axios.post("/chat", {
              from: localStorage.getItem("username"),
              to: this.selectedUser,
              content: this.newMessage
            });
            if(res.status === 200 || res.status === 201) {
              // Mensaje enviado correctamente
              this.messages.push({ from: "Tú", content: this.newMessage });
              console.log("Mensaje enviado");

              // Mover el chat al principio de la lista
              const index = this.users.indexOf(this.selectedUser);
              this.users.splice(index, 1);
              this.users.unshift(this.selectedUser);
            } 
            else {
              // Error al enviar el mensaje
              console.error("Error al enviar el mensaje");
            }

          }
          // Error 404 si el usuario no existe
          catch(err){
            alert("El usuario no existe");
            const index = this.users.indexOf(this.selectedUser);

            this.users.splice(index, 1);
          }

          this.newMessage = ""; // Limpiar el campo de texto después de enviar el mensaje
        }
        this.$nextTick(() => {
          const element = this.$refs.messages;
          element.scrollTop = element.scrollHeight;
        });
      },
    },
    watch: {
      selectedUser() {
        this.$nextTick(() => {
          const element = this.$refs.messages;
          element.scrollTop = element.scrollHeight;
        });
      },
      messages() {
        this.$nextTick(() => {
          const element = this.$refs.messages;
          element.scrollTop = element.scrollHeight;
        });
      },
    },
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
  .message-container {
  max-width: 600px;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.custom-scrollbar::-webkit-scrollbar {
  @apply w-2; /* Ancho de la barra de scroll */
  @apply h-2; /* Ancho de la barra de scroll */
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-200 rounded-full; /* Color de fondo del área de la barra de scroll */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-gray-500 rounded-full; /* Color de la barra de scroll */
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-600; /* Color de la barra de scroll al pasar el mouse por encima */
}
  </style>
  