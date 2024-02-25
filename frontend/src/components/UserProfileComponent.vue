<template>
    <div class="dark:bg-gray-900">
        <Navbar />
        <div class="container mx-auto py-8">
            <div class="grid grid-cols-1 sm:grid-cols-12 gap-6 px-4">
                <div class="col-span-1 sm:col-span-3">
                    <div class="bg-gray-800 rounded-lg p-6 shadow-lg">
                        <div class="flex flex-col items-center">
                            <img src="https://randomuser.me/api/portraits/men/94.jpg"
                                class="w-32 h-32 bg-gray-300 rounded-full mb-4 shadow-md" />
                            <h1 class="text-2xl font-bold text-white">{{ user.username }}</h1>
                            <h2 class="text-sm text-gray-400">{{ user.nombre }}</h2>
                            <div class="mt-2 text-sm text-gray-400">Nivel 15</div>
                            <div class="mt-4 flex justify-center">
                                <a href="#" class="bg-indigo-600 hover:bg-blue-600 text-white py-2 px-6 rounded">Agregar
                                    Amigo</a>
                            </div>
                        </div>
                        <hr class="my-6 border-t border-gray-600">
                        <div class="text-white">
                            <div class="flex justify-between mb-2">
                                <div class="text-gray-400">Juego Favorito:</div>
                                <div class="font-semibold">Jesucristo</div>
                            </div>
                            <div class="flex justify-between mb-2">
                                <div class="text-gray-400">Horas de Juego:</div>
                                <div class="font-semibold">{{ user.horas_juego }}</div>
                            </div>
                            <div class="flex justify-between mb-2">
                                <div class="text-gray-400">Logros Desbloqueados:</div>
                                <div class="font-semibold">150</div>
                            </div>
                        </div>
                    </div>
                    <div class="mt-6">
                        <h2 class="text-xl font-bold mb-4 text-white">Juegos Recientes</h2>
                        <!-- Lista de juegos recientes -->
                    </div>
                    <div class="mt-6">
                        <h2 class="text-xl font-bold mb-4 text-white">Amigos</h2>
                        <!-- Lista de amigos -->
                    </div>
                </div>
                <div class="col-span-1 sm:col-span-9">
                    <div class="bg-gray-800 rounded-lg p-6 shadow-lg">
                        <h2 class="text-2xl font-bold mb-4 text-white">Sobre mí</h2>
                        <textarea class="w-full h-24 bg-gray-700 text-gray-300 p-2 mb-4" v-model="newDescription"></textarea>
                        <button @click="updateDescription" class="bg-indigo-600 hover:bg-blue-600 text-white py-2 px-6 rounded">Actualizar Descripción</button>
                    </div>
                    <div class="mt-6">
                        <h2 class="text-2xl font-bold mb-4 text-white">Últimas Noticias</h2>
                        <!-- Módulo de Últimas Noticias -->
                    </div>
                    <div class="mt-6">
                        <h2 class="text-2xl font-bold mb-4 text-white">Juegos Recomendados</h2>
                        <!-- Módulo de Juegos Recomendados -->
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script>
import Navbar from './navbarComponent.vue';
import Footer from './FooterComponent.vue';
import axios from '../main';

export default {
    components: {
        Navbar,
        Footer
    },
    data() {
        return {
            user: {
                username: '',
                nombre: '',
                descripcion: '',
                horas_juego: 0,
            },
            newDescription: '', // Nuevo campo para la descripción actualizada
        }
    },
    async created() {
        await this.getUser();
    },
    methods: {
        async getUser() {
            try {
                const response = await axios.get('/usuarios/me');
                this.user.username = response.data.username;
                this.user.nombre = response.data.nombre;
                this.user.descripcion = response.data.descripcion;
                this.user.horas_juego = response.data.horas_juego;
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    this.$router.push('/');
                } else {
                    console.error(error);
                }
            }
        },
        async updateDescription() {
            try {
                const response = await axios.put('/usuarios/me', { descripcion: this.newDescription });
                this.user.descripcion = this.newDescription;
                this.newDescription = ''; // Limpiar el campo de entrada después de la actualización
            } catch (error) {
                console.error(error);
            }
        },
    }
};
</script>

<style scoped>
/* Estilos personalizados */
</style>
