<template>
    <section>
        <Navbar />
        <div class="subastas-section py-8 bg-gray-900 text-white">
            <h2 class="text-2xl font-bold mb-4">Subastas</h2>
            <p class="mb-6 text-gray-400">Explora nuestras emocionantes subastas. ¡Haz tu oferta antes de que el tiempo se
                agote!</p>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
                <!-- Subastas -->
                <div v-for="item in subastas" :key="item.id"
                    class="bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
                    <span class="text-gray-300 text-4xl font-semibold mb-2">{{ item.counter }}</span>
                    <img :src="item.image" alt="Imagen de subasta" class="w-32 h-32 object-cover mb-2">
                    <h3 class="text-lg font-semibold mb-2">{{ item.name }}</h3>
                    <p class="text-gray-400 mb-2">{{ item.description }}</p>
                    <p class="text-gray-300 font-semibold">{{ item.price }}</p>
                    <p class="text-gray-300 font-semibold">{{ item.remainingTime }}</p>
                </div>
            </div>
        </div>
        <Footer />
    </section>
</template>
  
<script>
import Navbar from './navbarComponent.vue'; // Reemplaza './Navbar.vue' con la ruta correcta de tu componente Navbar
import Footer from './FooterComponent.vue'; // Reemplaza './Footer.vue' con la ruta correcta de tu componente Footer

export default {
    components: {
        Navbar,
        Footer,
    },
    name: 'SubastasSection',
    data() {
        return {
            subastas: [
                { id: 1, counter: 10, name: 'Producto 1', description: 'Descripción del producto 1', price: '$100', image: 'https://via.placeholder.com/150', remainingTime: 'Tiempo restante: 10:00' },
                { id: 2, counter: 8, name: 'Producto 2', description: 'Descripción del producto 2', price: '$150', image: 'https://via.placeholder.com/150', remainingTime: 'Tiempo restante: 08:30' },
                { id: 3, counter: 6, name: 'Producto 3', description: 'Descripción del producto 3', price: '$200', image: 'https://via.placeholder.com/150', remainingTime: 'Tiempo restante: 06:45' },
                { id: 4, counter: 4, name: 'Producto 4', description: 'Descripción del producto 4', price: '$250', image: 'https://via.placeholder.com/150', remainingTime: 'Tiempo restante: 04:20' },
                { id: 5, counter: 2, name: 'Producto 5', description: 'Descripción del producto 5', price: '$300', image: 'https://via.placeholder.com/150', remainingTime: 'Tiempo restante: 02:15' },
                // Agrega más elementos aquí si es necesario
            ]
        };
    },
    created() {
        this.startCountdown();
    },
    methods: {
        startCountdown() {
            setInterval(() => {
                this.subastas.forEach(item => {
                    const time = item.remainingTime.split(':');
                    let minutes = parseInt(time[0]);
                    let seconds = parseInt(time[1]);
                    if (seconds > 0) {
                        seconds--;
                    } else {
                        seconds = 59;
                        minutes--;
                    }
                    item.remainingTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                });
            }, 1000);
        }
    }
};
</script>
  
<style scoped>
/* Estilos específicos para este componente */
</style>
  