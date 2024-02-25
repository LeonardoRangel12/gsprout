<template>
    <div class="bg-gray-900 text-white">
        <div class="container mx-auto py-12">
            <section class="game-list-section mb-8">
                <h2 class="text-3xl font-bold mb-6 text-center">Featured Games</h2>
                <ul class="divide-y divide-gray-700">
                    <li v-for="(game, index) in featuredGames.slice(0, 10)" :key="game._id"
                        class="py-4 flex items-center justify-between">
                        <div class="flex items-center">
                            <img :src="game.imagen" :alt="game.nombre + ' Image'" class="h-16 w-16 object-cover rounded" />
                            <div class="ml-4">
                                <h3 class="text-xl font-bold">{{ game.nombre }}</h3>
                                <p class="text-gray-400">{{ game.descripcion }}</p>
                                <span v-if="game.oferta"
                                    class="bg-green-500 text-white text-xs px-2 py-1 rounded">Oferta</span>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <span class="flex items-center mr-4">
    <span class="text-white font-bold text-lg">{{ game.precio }}</span>
    <span class="ml-2"></span>
    <span class="text-gradient text-xs">SOL</span>
</span>

                            <span class="text-blue-500 font-bold mr-4">{{ (game.precio * SOL_TO_USD_RATE).toFixed(2) }} USD</span>
                            <button type="submit" @click="switchToBuy(game._id)"
                                class="py-1 px-2 bg-indigo-700 text-white font-bold rounded hover:bg-indigo-500">Comprar</button>
                        </div>
                    </li>
                </ul>
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
            featuredGames: [],
            newGames: [],
            SOL_TO_USD_RATE: 50, // Adjust this value based on the current exchange rate
        };
    },
    async created() {
        await this.getJuegos();
    },
    methods: {
        async getJuegos() {
            const res = await axios.get('/juegos');
            this.games = res.data;
            this.featuredGames = this.games;
            this.newGames = this.games;
        },
        switchToBuy(gameid) {
            this.$router.push('/solanaPay?id=' + gameid);
        }
    }
};
</script>
<style>
.text-gradient {
    background-image: linear-gradient(to right, #00FFA3, #03E1FF, #DC1FFF);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}
</style>