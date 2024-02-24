<template>
    <section class="bg-gray-900 text-white">
        <Navbar />
        <div class="subastas-section py-8">
            <h2 class="text-2xl font-bold mb-4">Subastas</h2>
            <p class="mb-6 text-gray-400">Explora nuestras emocionantes subastas. ¡Haz tu oferta antes de que el tiempo se
                agote!</p>
            <ul class="grid grid-cols-1 md:grid-cols-5 gap-6 p-10">
                <li v-for="item in subastas" :key="item.id" class="bg-gray-800 rounded-lg shadow-md">
                    <div class="p-6">
                        <span class="text-gray-300 text-4xl font-semibold">{{ item.counter }}</span>
                        <img :src="item.image" alt="Imagen de subasta" class="w-32 h-32 object-cover mt-4">
                        <h3 class="text-lg font-semibold my-4">{{ item.name }}</h3>
                        <p class="text-gray-400 mb-4">{{ item.description }}</p>
                        <div class="flex justify-between">
                            <p class="text-gray-300 font-semibold">{{ item.price }}</p>
                            <p class="text-gray-300 font-semibold">{{ item.remainingTime }}</p>
                        </div>
                        <button class="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4 font-semibold w-full">Pujar</button>
                    </div>
                </li>
            </ul>
        </div>
        <Footer />
    </section>
</template>
  
<script>
import Navbar from './navbarComponent.vue';
import Footer from './FooterComponent.vue';

export default {
    components: {
        Navbar,
        Footer,
    },
    name: 'SubastasSection',
    data() {
        return {
            subastas: [
                {
                    id: 1,
                    image: 'https://picsum.photos/200',
                    name: 'Producto 1',
                    description: 'Descripción del producto 1',
                    price: '$100',
                    remainingTime: '10:00',
                },
                {
                    id: 2,
                    image: 'https://picsum.photos/200',
                    name: 'Producto 2',
                    description: 'Descripción del producto 2',
                    price: '$150',
                    remainingTime: '08:30',
                },
                {
                    id: 3,
                    image: 'https://picsum.photos/200',
                    name: 'Producto 3',
                    description: 'Descripción del producto 3',
                    price: '$200',
                    remainingTime: '06:45',
                },
                {
                    id: 4,
                    image: 'https://picsum.photos/200',
                    name: 'Producto 4',
                    description: 'Descripción del producto 4',
                    price: '$250',
                    remainingTime: '04:20',
                },
                {
                    id: 5,
                    image: 'https://picsum.photos/200',
                    name: 'Producto 5',
                    description: 'Descripción del producto 5',
                    price: '$300',
                    remainingTime: '02:15',
                },
            ],
        };
    },
    created() {
        this.startCountdown();
    },
    methods: {
        startCountdown() {
            setInterval(() => {
                this.subastas.forEach((item) => {
                    const time = item.remainingTime.split(':');
                    let minutes = parseInt(time[0]);
                    let seconds = parseInt(time[1]);
                    if (seconds > 0 || minutes > 0) {
                        if (seconds === 0) {
                            minutes--;
                            seconds = 59;
                        } else {
                            seconds--;
                        }
                        item.remainingTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    }
                });
            }, 1000);
        },
    },
};
</script>
  
<style scoped>
/* Estilos CSS personalizados para este componente */
.subastas-section {
    max-width: 1200px;
    margin: 0 auto;
}
</style>
  