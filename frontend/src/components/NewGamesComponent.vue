<template>
  <div class="bg-gray-900 text-white">
    <div class="container mx-auto py-12 relative" @mousemove="updatePosition">
      <section class="game-list-section">
        <h2 class="text-3xl font-bold mb-6 text-center">Nuevos Juegos</h2>
        <div class="grid grid-cols-2 gap-6">
          <ul>
            <li v-for="(game, index) in newGames.slice(0,10)" :key="game._id" class="flex items-center justify-between py-4" @mouseenter="hoveredGame = game" @mouseleave="hoveredGame = null">
              <div class="flex items-center">
                <img :src="game.imagen" :alt="game.nombre + ' Image'" class="h-16 w-16 object-cover rounded" />
                <div class="ml-4">
                  <h3 class="text-xl font-bold">{{ game.nombre }}</h3>
                  
                  <span v-if="game.oferta" class="bg-green-500 text-white text-xs px-2 py-1 rounded mt-2 inline-block">Oferta</span>
                </div>
              </div>
              <div class="flex items-center">
                <div class="text-right">
                  <span class="text-white font-bold text-lg">{{ game.precio }}</span>
                  <span class="ml-1 text-gray-400 text-sm">SOL</span>
                  <br>
                  <span class="text-blue-500 font-bold">{{ (game.precio * SOL_TO_USD_RATE).toFixed(2) }}</span>
                  <span class="text-gray-400 text-sm">USD</span>
                </div>
                <button type="submit" @click="switchToBuy(game._id)" class="ml-4 bg-indigo-700 text-white font-bold py-2 px-4 rounded hover:bg-indigo-500">Comprar</button>
              </div>
            </li>
          </ul>
          <ul>
            <li v-for="(game, index) in newGames.slice(10, 20)" :key="'second_' + game._id" class="flex items-center justify-between py-4" @mouseenter="hoveredGame = game" @mouseleave="hoveredGame = null">
              <div class="flex items-center">
                <img :src="game.imagen" :alt="game.nombre + ' Image'" class="h-16 w-16 object-cover rounded" />
                <div class="ml-4">
                  <h3 class="text-xl font-bold">{{ game.nombre }}</h3>
                  
                  <span v-if="game.oferta" class="bg-green-500 text-white text-xs px-2 py-1 rounded mt-2 inline-block">Oferta</span>
                </div>
              </div>
              <div class="flex items-center">
                <div class="text-right">
                  <span class="text-white font-bold text-lg">{{ game.precio }}</span>
                  <span class="ml-1 text-gray-400 text-sm">SOL</span>
                  <br>
                  <span class="text-blue-500 font-bold">{{ (game.precio * SOL_TO_USD_RATE).toFixed(2) }}</span>
                  <span class="text-gray-400 text-sm">USD</span>
                </div>
                <button type="submit" @click="switchToBuy(game._id)" class="ml-4 bg-indigo-700 text-white font-bold py-2 px-4 rounded hover:bg-indigo-500">Comprar</button>
              </div>
            </li>
          </ul>
        </div>
        <!-- Tarjeta de información del juego -->
        <div v-if="hoveredGame" :style="{ top: cardPosition.y + 'px', left: cardPosition.x + 'px' }" class="absolute p-4 rounded-lg shadow-lg" style="width: 600px; height: 400px;">
          <h3 class="text-xl font-bold">{{ hoveredGame.nombre }}</h3>
          <img :src="hoveredGame.imagen" :alt="hoveredGame.nombre" class="w-full h-auto rounded-lg mt-2" style="max-height: 300px;">
          <p class="text-gray-300">{{ hoveredGame.descripcion }}</p>
          <span v-if="hoveredGame.oferta" class="bg-green-500 text-white text-xs px-2 py-1 rounded mt-2 inline-block">Oferta</span>
          <div class="text-right mt-2">
            <span class="text-gray-300 font-bold">{{ hoveredGame.precio }}</span>
            <span class="ml-1 text-gray-400 text-sm">SOL</span>
            <br>
            <span class="text-blue-500 font-bold">{{ (hoveredGame.precio * SOL_TO_USD_RATE).toFixed(2) }}</span>
            <span class="text-gray-400 text-sm">USD</span>
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
    // async getJuegos() {
    //   try {
    //     const res = await axios.get('/juegos');
    //     this.games = res.data;
    //     this.newGames = this.games;
    //   } catch (error) {
    //     console.error('Error al obtener los juegos:', error);
    //   }
    // },
    // async getExchange() {
    //   try {
    //     const res = await axios.get('/exchange');
    //     this.SOL_TO_USD_RATE = res.data.sell;
    //   } catch (error) {
    //     console.error('Error al obtener el tipo de cambio:', error);
    //   }
    // },
    switchToBuy(gameid) {
      // Redirigir al usuario a la página de registro
      this.$router.push('/solanaPay?id=' + gameid + '&&price=' + this.games.find(game => game._id === gameid).precio);
    },
    updatePosition(event) {
      const windowCenterX = window.innerWidth / 2;
      const cardWidth = 600; // Ancho de la tarjeta
      const buffer = 20; // Margen para evitar que la tarjeta se salga del borde

      let xPos = event.clientX;
      if (xPos > windowCenterX) {
        // Si el mouse está a la derecha del centro de la ventana, mover la tarjeta a la izquierda
        xPos -= cardWidth + buffer;
      } else {
        // Si el mouse está a la izquierda del centro de la ventana, mover la tarjeta a la derecha
        xPos += buffer;
      }

      this.cardPosition = {
        x: xPos,
        y: event.clientY
      };
    }
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
