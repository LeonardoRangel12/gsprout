<template>
  <Navbar @message="pushMessage" />
  <section class="flex h-[calc(100vh-96px)]">
    <!-- Lista de usuarios -->
    <div class="w-1/4 p-4 bg-gray-900 text-white">
      <h2 class="text-lg font-bold mb-4">Username</h2>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar usuario..."
        class="w-full p-2 mb-4 rounded-md bg-gray-800 text-white"
      />
      <ul>
        <li
          v-for="(user, index) in filteredUsers"
          v-if="filteredUsers.length > 0"
          :key="index"
          class="cursor-pointer mb-2"
          @click="selectUser(user)"
        >
          {{ user }}
        </li>
        <li v-else>
          <button
            class="bg-blue-500 text-white py-2 px-4 mt-2 mb-2 rounded-md"
            @click="selectUser(searchQuery)"
          >
            New chat
          </button>
        </li>
      </ul>
    </div>
    <!-- Lista de mensajes -->
    <div class="w-3/4 p-4 bg-gray-800 text-white flex flex-col h-full">
      <h2 class="text-lg font-bold mb-4">Chat with {{ selectedUser }}</h2>
      <div
        class="flex-grow overflow-auto custom-scrollbar"
        ref="messages"
        @scroll="handleScroll"
      >
        <div v-if="selectedUser">
          <div v-for="(message, index) in messages" :key="index" class="mb-2">
            <div
              :class="
                message.from === selectedUser ? 'text-left' : 'text-right'
              "
            >
              <span
                class="inline-block bg-gray-700 px-3 py-1 rounded-lg message-container mr-4"
                >{{ message.content }}</span
              >
            </div>
          </div>
        </div>
        <div v-else>
          <p>Select a user to start chatting.</p>
        </div>
      </div>
      <div class="flex mt-4">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Escribe un mensaje..."
          class="w-full p-2 rounded-l-md bg-gray-700 text-white"
          @keyup.enter="sendMessage"
        />
        <button
          @click="sendMessage"
          class="bg-blue-500 text-white py-2 px-4 rounded-r-md"
        >
          Send
        </button>
      </div>

      <!-- <button @click="loadMoreMessages" v-if="hasMoreMessages">Cargar más</button>  -->
    </div>
  </section>
</template>

<script>
import { ref } from "vue";
import Navbar from "./navbarComponent.vue";
import Footer from "./FooterComponent.vue";
import axios from "../main";
import Swal from "sweetalert2"; // Importa SweetAlert
import { getUserSession } from "../apis";
export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      users: [], // Lista de usuarios
      searchQuery: "", // Query de búsqueda
      selectedUser: null, // Usuario seleccionado
      messages: [], // Lista de mensajes
      newMessage: "", // Nuevo mensaje a enviar
      selectedChat: null,
      currentPage: 0,
      loadingMessages: false,
      hasMoreMessages: true,
      lastScrollTop: 0, // Variable para almacenar la posición del scroll
    };
  },
  async setup() {
    try{
    const users = ref([]);
    const res = await axios.get("/chat");
    if (res.status === 200) {
      users.value = res.data;
    } else {
      // Error al cargar los usuarios
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error loading users! Please try again.",
      });
    }
    return { users };
    }catch(error){

    }
  },
  async mounted(){
    const hasSession = getUserSession();
    this.checkSession(hasSession);
  },
  computed: {
    filteredUsers() {
      const search = this.users.filter((user) =>
        user.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      return search;
    },
  },
  methods: {
    async selectUser(user) {
      this.selectedUser = user;
      this.messages = []; // Limpiar mensajes al cambiar de chat
      this.currentPage = 0;
      if (this.users.indexOf(user) === -1) {
        this.users.unshift(user);
      }
      // Cargar mensajes al seleccionar un usuario por primera vez
      if (!this.messages.length) {
        await this.loadMoreMessages();
      }
      // Simular carga de mensajes (esto podría venir de una API)
      const res = await axios.get(
        `/chat/${this.selectedUser}?page_number=${this.currentPage}`
      );
      if (res.status === 200) {
        for (let message in res.data) {
          if (message.from === localStorage.getItem("username")) {
            message.from = "Tú";
          }
        }
        this.messages = res.data.reverse();
      } else {
        // Error al cargar los mensajes
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error loading messages! Please try again.",
        });
      }
      // Scroll to bottom only after selecting a new user
      this.$nextTick(() => {
        const element = this.$refs.messages;
        element.scrollTop = element.scrollHeight;
      });
    },
    checkSession(session){
      if(!session){
        this.$router.push('/login')
      }
    },
    handleScroll() {
      const messagesElement = this.$refs.messages;
      const scrollPosition = messagesElement.scrollTop;
      const scrollHeight = messagesElement.scrollHeight;
      const clientHeight = messagesElement.clientHeight;

      if (scrollPosition === 0 && this.hasMoreMessages) {
        this.loadMoreMessages();
      }
    },
    async loadMoreMessages() {
      this.loadingMessages = true;
      try {
        const res = await axios.get(
          `/chat/${this.selectedUser}?page_number=${this.currentPage + 1}`
        );
        console.log(res.data);
        if (res.data.length > 0) {
          // Almacenar la posición del scroll antes de cargar nuevos mensajes**
          const scrollTopBeforeLoad = this.$refs.messages.scrollTop;

          // Agregar los nuevos mensajes al principio del array
          const newMessages = res.data.reverse();
          this.messages = [...newMessages, ...this.messages];
          this.currentPage++;

          // Restablecer la posición del scroll después de cargar nuevos mensajes**
          this.$nextTick(() => {
            const element = this.$refs.messages;
            const scrollHeightAfterLoad = element.scrollHeight;

            // Calcular la nueva posición del scroll para mantener la vista en la misma posición
            const newScrollTop =
              scrollTopBeforeLoad +
              (scrollHeightAfterLoad - this.lastScrollTop);
            element.scrollTop = newScrollTop;

            // Actualizar la variable `lastScrollTop` para la próxima carga de mensajes
            this.lastScrollTop = scrollHeightAfterLoad;
          });
        } else {
          this.hasMoreMessages = false;
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error loading messages! Please try again.",
        });
      } finally {
        this.loadingMessages = false;
      }
    },
    async sendMessage() {
      // Aquí puedes implementar la lógica para enviar mensajes
      if (this.newMessage.trim() !== "") {
        try {
          const res = await axios.post("/chat", {
            from: localStorage.getItem("username"),
            to: this.selectedUser,
            content: this.newMessage,
          });
          if (res.status === 200 || res.status === 201) {
            // Mensaje enviado correctamente
            this.messages.push({ from: "Tú", content: this.newMessage });
            console.log("Mensaje enviado");

            // Mover el chat al principio de la lista
            const index = this.users.indexOf(this.selectedUser);
            this.users.splice(index, 1);
            this.users.unshift(this.selectedUser);
          } else {
            // Error al enviar el mensaje
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error sending message! Please try again.",
            });
          }
        } catch (err) {
          // Error 404 si el usuario no existe
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "User not found! Please try again.",
          });
          const index = this.users.indexOf(this.selectedUser);

          this.users.splice(index, 1);
        }

        this.newMessage = ""; // Limpiar el campo de texto después de enviar el mensaje
      }
      // Scroll to bottom only after selecting a new user
      this.$nextTick(() => {
        const element = this.$refs.messages;
        element.scrollTop = element.scrollHeight;
      });
    },
    pushMessage(message) {
      // If the message is for the current user, add it to the messages array
      if (message.to === localStorage.getItem("username") && this.messages[this.messages.length - 1].content !== message.content)
        this.messages.push({ from: "Tú", content: message.content });
      else this.messages.push({ from: message.from, content: message.content });
    },
  },
  watch: {},
};
</script>

<style scoped>
/* Estilos CSS personalizados con tema oscuro */
input[type="text"],
button {
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
