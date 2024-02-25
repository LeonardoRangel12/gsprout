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
                            <h1 class="text-2xl font-bold text-white">John Doe</h1>
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
                                <div class="font-semibold">The Witcher 3</div>
                            </div>
                            <div class="flex justify-between mb-2">
                                <div class="text-gray-400">Horas de Juego:</div>
                                <div class="font-semibold">250 horas</div>
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
                        <p class="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est
                            vitae tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                            suscipit. Nunc finibus vel ante id euismod. Vestibulum ante ipsum primis in faucibus orci luctus
                            et ultrices posuere cubilia Curae; Aliquam erat volutpat. Nulla vulputate pharetra tellus, in
                            luctus risus rhoncus id.
                        </p>
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

export default {
    components: {
        Navbar,
        Footer
    }
};
</script>
  
<style scoped>
/* Estilos personalizados */
</style>
  