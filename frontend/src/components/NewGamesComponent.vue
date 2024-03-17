<template>
  <div class="bg-gray-900 text-white">
    <div class="container mx-auto py-12">
      <section class="game-list-section">
        <h2 class="text-3xl font-bold mb-6 text-center">Nuevos Juegos</h2>
        <div class="grid grid-cols-2 gap-6">
          <ul>
            <li v-for="(game, index) in newGames.slice(0, 10)" :key="game._id" class="flex items-center justify-between py-4">
              <div class="flex items-center">
                <img :src="game.imagen" :alt="game.nombre + ' Image'" class="h-16 w-16 object-cover rounded" />
                <div class="ml-4">
                  <h3 class="text-xl font-bold">{{ game.nombre }}</h3>
                  <p class="text-gray-400">{{ game.descripcion }}</p>
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
            <li v-for="(game, index) in newGames.slice(10, 20)" :key="'second_' + game._id" class="flex items-center justify-between py-4">
              <div class="flex items-center">
                <img :src="game.imagen" :alt="game.nombre + ' Image'" class="h-16 w-16 object-cover rounded" />
                <div class="ml-4">
                  <h3 class="text-xl font-bold">{{ game.nombre }}</h3>
                  <p class="text-gray-400">{{ game.descripcion }}</p>
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
      </section>
    </div>
  </div>
</template>

<script>
import axios from '../main';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      games: [],
      newGames: [],
      SOL_TO_USD_RATE: 50 // Ajusta este valor según el tipo de cambio actual
    };
  },
  async created() {
    await this.getJuegos();
    await this.getExchange();
  },
  methods: {
    async getJuegos() {
      try {
        const res = await axios.get('/juegos');
        this.games = res.data;
        this.newGames = this.games;
      } catch (error) {
        console.error('Error al obtener los juegos:', error);
      }
    },
    async getExchange() {
      try {
        const res = await axios.get('/exchange');
        this.SOL_TO_USD_RATE = res.data.sell;
      } catch (error) {
        console.error('Error al obtener el tipo de cambio:', error);
      }
    },
    switchToBuy(gameid) {
      // Redirigir al usuario a la página de registro
      this.$router.push('/solanaPay?id=' + gameid + '&&price=' + this.games.find(game => game._id === gameid).precio);
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
