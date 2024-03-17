<template>
    <div class="relative w-160 h-90 mx-auto overflow-hidden">
      <div class="flex transition-transform duration-500" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <img v-for="game in newGames" :key="game._id" :src="game.imagen" :alt="game.nombre + ' Image'" class="w-160 h-90 object-cover" />
      </div>
      <button @click="prev" class="absolute top-1/2 left-0 transform -translate-y-1/2 ml-2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl">&#8249;</button>
      <button @click="next" class="absolute top-1/2 right-0 transform -translate-y-1/2 mr-2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl">&#8250;</button>
    </div>
  </template>
  
  <script>
  import axios from '../main';
  
  export default {
    data() {
      return {
        newGames: [],
        currentIndex: 0,
        timer: null
      };
    },
    async created() {
      try {
        const res = await axios.get('/juegos');
        this.newGames = res.data;
        this.startCarousel();
      } catch (error) {
        console.error('Error al obtener los juegos:', error);
      }
    },
    methods: {
      startCarousel() {
        this.timer = setInterval(this.next, 2000);
      },
      stopCarousel() {
        clearInterval(this.timer);
      },
      next() {
        this.currentIndex = (this.currentIndex + 1) % this.newGames.length;
      },
      prev() {
        this.currentIndex = (this.currentIndex - 1 + this.newGames.length) % this.newGames.length;
      }
    }
  };
  </script>
  