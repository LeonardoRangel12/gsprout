<template>
    <div class="dark:bg-gray-900">
        <Navbar />
        <div class="container mx-auto py-8">
            <div class="grid grid-cols-1 sm:grid-cols-20 gap-6 px-4">
                <div class="col-span-1 sm:col-span-9">
                    <div class="bg-gray-800 rounded-lg p-6 shadow-lg">

                        <div class="bg-gray-200 rounded-lg p-6 shadow-lg">
                        <img src="https://imgur.com/5O9qO7w" class="w-full rounded-md">
                        <div class="flex justify-between items-center mt-4">
                            <span class="text-lg font-bold">$19.99</span> 
                            <button class="bg-blue-500 text-white px-3 py-2 rounded-md">Comprar</button>
                        </div>
                    </div>
                        <h2 class="text-2xl font-bold mb-4 text-white">Name Game</h2>
                        <h2 class="text-2xl font-bold mb-4 text-white">Descripcion</h2>
                        <p class="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est
                            vitae tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas
                            suscipit. Nunc finibus vel ante id euismod. Vestibulum ante ipsum primis in faucibus orci luctus
                            et ultrices posuere cubilia Curae; Aliquam erat volutpat. Nulla vulputate pharetra tellus, in
                            luctus risus rhoncus id.
                        </p>
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
  