<section class="game-list-section mb-8">
    <h2 class="text-3xl font-bold mb-6 text-center">New Releases</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div v-for="game in newGames" :key="game.id" class="game-card bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <img :src="game.imagen" :alt="game.nombre + ' Image'" class="game-image h-64 w-full object-cover" />
        <div class="p-4">
          <h3 class="text-xl font-bold mb-2">{{ game.nombre }}</h3>
          <p class="text-gray-400">{{ game.descripcion }}</p>
          <button @click="addToCart(game)" class="block w-full mt-4 py-2 px-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600">Add to Cart</button>
        </div>
      </div>
    </div>
  </section>