<template>
  <div class="bg-gray-950 text-white">
    <div class="container mx-auto py-12 relative">
      <section class="game-list-section" @mousemove="updatePosition">
        <h2 class="text-3xl font-bold mb-6 text-center">New Games</h2>
        <div class="grid gap-6 md:grid-cols-2">
          <!-- Itera sobre la primera mitad de los juegos -->
          <ul>
            <li v-for="(game, index) in firstHalf" :key="game._id" class="flex flex-col md:flex-row items-center justify-between py-4" @mouseenter="hoveredGame = game" @mouseleave="hoveredGame = null">
              <div class="flex items-center mb-4 md:mb-0">
                <img :src="game.imagen" :alt="game.nombre + ' Image'" class="w-full md:w-48 h-auto md:h-auto object-cover rounded-lg" />
                <div class="ml-4">
                  <h3 class="text-xl font-bold">{{ game.nombre }}</h3>
                  
                  <span v-if="game.oferta" class="bg-green-500 text-white text-xs px-2 py-1 rounded mt-2 inline-block">Offer</span>
                </div>
              </div>
              <div class="flex flex-col md:flex-row items-center">
                <div class="text-right mb-4 md:mb-0 md:ml-6">
                  <span class="text-white font-bold text-lg">{{ (game.precio).toFixed(2) }}</span>
                  <span class="ml-1 text-gray-400 text-sm">USD</span>
                  <br>
                  <span class="text-blue-500 font-bold">{{ (game.precio / SOL_TO_USD_RATE).toFixed(9) }}</span>
                  <span class="text-gray-400 text-sm">SOL</span>
                </div>
                <button type="submit" @click="switchToDetails(game._id)" class="ml-4 bg-indigo-700 text-white font-bold py-2 px-4 rounded hover:bg-indigo-500">Details</button>
              </div>
            </li>
          </ul>
          <!-- Itera sobre la segunda mitad de los juegos -->
          <ul>
            <li v-for="(game, index) in secondHalf" :key="game._id" class="flex flex-col md:flex-row items-center justify-between py-4" @mouseenter="hoveredGame = game" @mouseleave="hoveredGame = null">
              <div class="flex items-center mb-4 md:mb-0">
                <img :src="game.imagen" :alt="game.nombre + ' Image'" class="w-full md:w-48 h-auto md:h-auto object-cover rounded-lg" />
                <div class="ml-4">
                  <h3 class="text-xl font-bold">{{ game.nombre }}</h3>
                  
                  <span v-if="game.oferta" class="bg-green-500 text-white text-xs px-2 py-1 rounded mt-2 inline-block">Offer</span>
                </div>
              </div>
              <div class="flex flex-col md:flex-row items-center">
                <div class="text-right mb-4 md:mb-0 md:ml-6">
                  <span class="text-white font-bold text-lg">{{ (game.precio).toFixed(2) }}</span>
                  <span class="ml-1 text-gray-400 text-sm">USD</span>
                  <br>
                  <span class="text-blue-500 font-bold">{{ (game.precio / SOL_TO_USD_RATE).toFixed(9) }}</span>
                  <span class="text-gray-400 text-sm">SOL</span>
                </div>
                <button type="submit" @click="switchToDetails(game._id)" class="ml-4 bg-indigo-700 text-white font-bold py-2 px-4 rounded hover:bg-indigo-500">Details</button>
              </div>
            </li>
          </ul>
        </div>
        <!-- Tarjeta de información del juego -->
        <div v-if="hoveredGame" class="bg-gray-900 absolute p-4 rounded-lg shadow-lg" style="width: 90%; max-width: 600px;" :style="{ top: cardPosition.y + 'px', left: cardPosition.x + 'px' }">
          <h3 class="text-xl font-bold">{{ hoveredGame.nombre }}</h3>
          <img :src="hoveredGame.imagen" :alt="hoveredGame.nombre" class="w-full h-auto rounded-lg mt-2" style="aspect-ratio: 16/9; max-height: 300px;">
          <p class="text-gray-300 text-justify">{{ truncar(hoveredGame.descripcion) }}</p>
          <span v-if="hoveredGame.oferta" class="bg-green-500 text-white text-xs px-2 py-1 rounded mt-2 inline-block">Offer</span>
          <div class="text-right mt-2 ">
            <span class="text-gray-300 font-bold">{{ (hoveredGame.precio).toFixed(2) }}</span>
            <span class="ml-1 text-gray-400 text-sm">USD</span>
            <br>
            <span class="text-blue-500 font-bold">{{ (hoveredGame.precio / SOL_TO_USD_RATE).toFixed(9) }}</span>
            <span class="text-gray-400 text-sm">SOL</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import Swal from 'sweetalert2';
export default {
  props: {
    games: {
      type: Array,
      default: []
    },
    SOL_TO_USD_RATE: {
      type: Number,
      default: 50
    }
  },
  setup(props) {
    // Calcula la longitud de la lista de juegos
    const halfIndex = Math.ceil(props.games.length / 2);
    // Divide la lista de juegos en dos partes
    const firstHalf = ref(props.games.slice(0, halfIndex));
    const secondHalf = ref(props.games.slice(halfIndex));
    
    const hoveredGame = ref(null);
    const cardPosition = ref({ x: 0, y: 0 });

    const switchToDetails = (gameid) => {
      try {
        const juego = props.games.find((game) => game._id === gameid);
        if (!juego) {
          throw new Error("Game not found");
        }
        // Assuming you have access to router instance
        router.push(`/gameView?id=${juego._id}&price=${juego.precio}`);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Game not found"
        });
      }
    };

    const truncar = (text, maxLength = 240) => {
      return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
    };

    const updatePosition = (event) => {
      const containerRect = event.currentTarget.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const cardWidth = 600; // Ancho de la tarjeta
      const cardHeight = 400; // Altura de la tarjeta
      const buffer = 20; // Margen para evitar que la tarjeta se salga del borde
      const columnWidth = containerWidth / 2; // Ancho de cada columna
      const mouseXRelativeToContainer = event.clientX - containerRect.left;
      let xPos;
      if (mouseXRelativeToContainer < columnWidth) {
        // Si el mouse está en la columna izquierda, mover la tarjeta a la derecha
        xPos = event.clientX + buffer;
      } else {
        // Si el mouse está en la columna derecha, mover la tarjeta 950 píxeles a la izquierda del mouse
        xPos = event.clientX - 950;
      }
      let yPos = event.clientY - cardHeight / 2; // Centrar la tarjeta en el eje Y del mouse
      // Verificar si la tarjeta se sale del borde superior de la pantalla
      const topEdge = buffer;
      if (yPos < topEdge) {
        yPos = topEdge;
      }
      // Verificar si la tarjeta se sale del borde inferior de la pantalla
      const bottomEdge = window.innerHeight - cardHeight - buffer;
      if (yPos > bottomEdge) {
        yPos = bottomEdge;
      }
      cardPosition.value = {
        x: xPos,
        y: yPos
      };
    };

    return { firstHalf, secondHalf, hoveredGame, cardPosition, switchToDetails, truncar, updatePosition };
  }
};
</script>

<style scoped>
/* Estilos específicos para este componente van aquí */
</style>
