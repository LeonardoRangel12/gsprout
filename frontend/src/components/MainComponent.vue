<template>
    <div class="game-store">
        <h1 class="text-4xl font-bold mb-8">Welcome to the Game Store</h1>
        <div class="game-list grid grid-cols-3 gap-4">
            <div v-for="game in games" :key="game.id" class="game-card p-4 border border-gray-300 rounded-lg">
                <img :src="game.image" alt="Game Image" class="game-image mb-4" />
                <h2 class="text-xl font-bold">{{ game.title }}</h2>
                <p class="text-gray-600">{{ game.description }}</p>
                <button @click="addToCart(game)" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Add to Cart</button>
            </div>
        </div>
        <div class="cart mt-8">
            <h2 class="text-2xl font-bold mb-4">Shopping Cart</h2>
            <ul>
                <li v-for="item in cart" :key="item.id" class="mb-2">
                    {{ item.title }} - ${{ item.price }}
                </li>
            </ul>
            <button @click="checkout" class="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Checkout</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            games: [
                {
                    id: 1,
                    title: "Game 1",
                    description: "Description of Game 1",
                    image: "game1.jpg",
                    price: 19.99
                },
                {
                    id: 2,
                    title: "Game 2",
                    description: "Description of Game 2",
                    image: "game2.jpg",
                    price: 29.99
                },
                // Add more games here
            ],
            cart: []
        };
    },
    methods: {
        addToCart(game) {
            this.cart.push(game);
        },
        checkout() {
            // Implement checkout logic here
        }
    }
};
</script>

<style>
/* Add your custom styles here */
</style>
