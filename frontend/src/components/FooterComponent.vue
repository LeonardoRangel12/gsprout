<template>
  <footer class="hero bg-gray-900 text-gray-300 py-20 px-4 text-center">
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap text-center lg:text-left">
        <div class="w-full lg:w-6/12 px-4">
          <h4 class="text-3xl font-semibold text-white">¡Mantengámonos en contacto!</h4>
          <h5 class="text-lg mt-0 mb-2 text-blueGray-200">
            Encuéntranos en cualquiera de estas plataformas, respondemos en 1-2 días hábiles.
          </h5>
          <div class="mt-6 lg:mb-0 mb-6 flex justify-center lg:justify-start">
            <button class="bg-white text-lightBlue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2" type="button">
              <i class="fab fa-twitter flex justify-center items-center">
                <a href="https://twitter.com/HypirionGSprout">
                  <img class="h-6" src="https://about.twitter.com/content/dam/about-twitter/x/brand-toolkit/logo-black.png.twimg.1920.png" alt="logo">

                </a>
              </i>
            </button>
            <!-- Agrega más botones de redes sociales si es necesario -->
          </div>
        </div>
        <div class="w-full lg:w-6/12 px-4 mt-6 lg:mt-0">
          <div class="flex flex-wrap items-top mb-6">
            <div class="w-full lg:w-6/12 px-4 ml-auto">
              <span class="block uppercase text-blueGray-500 text-sm font-semibold mb-2">Enlaces Útiles</span>
              <ul class="list-unstyled">
                <!-- Enlaces a las diferentes páginas -->
                <li>
                  <router-link class="text-blueGray-200 hover:text-gray-300 font-semibold block pb-2 text-sm" to="/main">Inicio</router-link>
                </li>
                <li>
                  <router-link class="text-blueGray-200 hover:text-gray-300 font-semibold block pb-2 text-sm" to="/Store">Tienda</router-link>
                </li>
                <li>
                  <router-link class="text-blueGray-200 hover:text-gray-300 font-semibold block pb-2 text-sm" to="/auctions">Subastas</router-link>
                </li>
                <li>
                  <router-link class="text-blueGray-200 hover:text-gray-300 font-semibold block pb-2 text-sm" to="/intercambios">Intercambios</router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <hr class="my-6 border-blueGray-300">
      <div class="flex flex-wrap items-center md:justify-between justify-center">
        <div class="w-full md:w-4/12 px-4 mx-auto text-center">
          <div class="text-sm text-blueGray-500 font-semibold py-1">
            Derechos de autor © <span id="get-current-year">2024</span> gsprout. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  // Si necesitas lógica específica para el footer, puedes agregarla aquí.
}
</script>

<style scoped>
/* Estilos específicos para el componente del footer */
</style>
