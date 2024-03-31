<template>
  <div class="bg-gray-950 text-white">
    <div class="container mx-auto py-12 relative" @mousemove="updatePosition">
      <section class="game-list-section">
        <h2 class="text-3xl font-bold mb-6 text-center">New Games</h2>
        <div class="grid grid-cols-2 gap-6">
          <ul>
            <li v-for="(game, index) in newGames.slice(0,10)" :key="game._id" class="flex items-center justify-between py-4" @mouseenter="hoveredGame = game" @mouseleave="hoveredGame = null">
              <div class="flex items-center">
                <img :src="game.imagen" :alt="game.nombre + ' Image'" class="h-16 w-16 object-cover rounded" />
                <div class="ml-4">
                  <h3 class="text-xl font-bold">{{ game.nombre }}</h3>
                  
                  <span v-if="game.oferta" class="bg-green-500 text-white text-xs px-2 py-1 rounded mt-2 inline-block">Offert</span>
                </div>
              </div>
              <div class="flex items-center">
                <div class="text-right">
                  <span class="text-white font-bold text-lg">{{ (game.precio).toFixed(2) }}</span>
                  <span class="ml-1 text-gray-400 text-sm">USD</span>
                  <br>
                  <span class="text-blue-500 font-bold">{{ (game.precio / SOL_TO_USD_RATE).toFixed(9) }}</span>
                  <span class="text-gray-400 text-sm">SOL</span>
                </div>
                <button type="submit" @click="switchToDetails(game._id)" class="ml-4 bg-indigo-700 text-white font-bold py-2 px-4 rounded hover:bg-indigo-500">Comprar</button>
              </div>
            </li>
          </ul>
          <ul>
            <li v-for="(game, index) in newGames.slice(10,20)" :key="game._id" class="flex items-center justify-between py-4" @mouseenter="hoveredGame = game" @mouseleave="hoveredGame = null">
              <div class="flex items-center">
                <img :src="game.imagen" :alt="game.nombre + ' Image'" class="h-16 w-16 object-cover rounded" />
                <div class="ml-4">
                  <h3 class="text-xl font-bold">{{ game.nombre }}</h3>
                  
                  <span v-if="game.oferta" class="bg-green-500 text-white text-xs px-2 py-1 rounded mt-2 inline-block">Offert</span>
                </div>
              </div>
              <div class="flex items-center">
                <div class="text-right">
                  <span class="text-white font-bold text-lg">{{ (game.precio).toFixed(2) }}</span>
                  <span class="ml-1 text-gray-400 text-sm">USD</span>
                  <br>
                  <span class="text-blue-500 font-bold">{{ (game.precio / SOL_TO_USD_RATE).toFixed(9) }}</span>
                  <span class="text-gray-400 text-sm">SOL</span>
                </div>
                <button type="submit" @click="switchToDetails(game._id)" class="ml-4 bg-indigo-700 text-white font-bold py-2 px-4 rounded hover:bg-indigo-500">Comprar</button>
              </div>
            </li>
          </ul>
        </div>
        <!-- Tarjeta de información del juego -->
        <div v-if="hoveredGame" :style="{ top: cardPosition.y + 'px', left: cardPosition.x + 'px' }" class="bg-gray-900 absolute p-4 rounded-lg shadow-lg" style="width: 600px;">
          <h3 class="text-xl font-bold">{{ hoveredGame.nombre }}</h3>
          <img :src="hoveredGame.imagen" :alt="hoveredGame.nombre" class="w-full h-auto rounded-lg mt-2" style="max-height: 300px;">
          <p class="text-gray-300 text-justify">{{ truncar(hoveredGame.descripcion) }}</p>
          <span v-if="hoveredGame.oferta" class="bg-green-500 text-white text-xs px-2 py-1 rounded mt-2 inline-block">Offert</span>
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
import { inject, ref, watchEffect } from 'vue';

export default {
  data() {
    return {
      games: [],
      newGames: [],
      SOL_TO_USD_RATE: ref(50),
      hoveredGame: null,
      cardPosition: { x: 0, y: 0 }
    };

  },
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
  setup(props){
    const games = props.games;
    const newGames = games;
    const SOL_TO_USD_RATE = props.SOL_TO_USD_RATE;
    return { games, newGames, SOL_TO_USD_RATE };
  },
  mounted(){
  },
  async created() {
    // await this.getJuegos();
    // await this.getExchange();
  },
  methods: {
    // Otros métodos omitidos por brevedad
    
    truncar(text, maxLength = 240) {
      return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
    },
    switchToBuy(gameid) {
      // Redirigir al usuario a la página de registro
      this.$router.push('/solanaPay?id=' + gameid + '&&price=' + this.games.find(game => game._id === gameid).precio);
    },
    async switchToDetails(gameid) {
      try {
        const juego = this.games.find((game) => game._id === gameid);
        if (!juego) {
          throw new Error("Juego no encontrado");
        }
        this.$router.push(`/gameView?id=${juego._id}&price=${juego.precio}`);
      } catch (error) {
        console.error(error);
      }
    },
    updatePosition(event) {
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
      this.cardPosition = {
        x: xPos,
        y: yPos
      };
    },
  }
};
</script>

<style scoped>
/* Estilos específicos para este componente van aquí */
.text-gradient {
  background-image: linear-gradient(to right, #00FFA3, #03E1FF, #DC1FFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
