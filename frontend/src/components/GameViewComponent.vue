<template>
    <div class="dark:bg-gray-900">
        <Navbar />
        <div class="container mx-auto py-8">
            <div class="grid grid-cols-1 sm:grid-cols-20 gap-6 px-4">
                <div class="col-span-1 sm:col-span-9">
                    <div class="bg-gray-800 rounded-lg p-6 shadow-lg">
                        <div class="flex flex-col bg-gray-700 rounded-lg p-4 shadow-lg md:flex-row">
                            <div class="grid gap-4 mb-4 md:mb-0 md:mr-4">
                                <div>
                                <img class="h-auto w-full rounded-lg" src="https://imgur.com/jFEwdGp.jpg" alt="">
                                </div>
                                <div class="grid grid-cols-5 gap-4">
                                <div>
                                    <img class="h-auto max-w-full rounded-lg" src="https://imgur.com/bMDFXHK.jpg" alt="">
                                </div>
                                <div>
                                    <img class="h-auto max-w-full rounded-lg" src="https://imgur.com/75SiTJW.jpg" alt="">
                                </div>
                                <div>
                                    <img class="h-auto max-w-full rounded-lg" src="https://imgur.com/APzwUim.jpg" alt="">
                                </div>
                                <div>
                                    <img class="h-auto max-w-full rounded-lg" src="https://imgur.com/HLyiTZu.jpg" alt="">
                                </div>
                                <div>
                                    <img class="h-auto max-w-full rounded-lg" src="https://imgur.com/J0kJ5Fh.jpg" alt="">
                                </div>
                                </div>
                            </div>
                            <div flex flex-col>
                                <div>
                                    <img class="h-auto max-w-full rounded-lg" src="https://imgur.com/CxPhhR5.jpg" alt="">
                                </div>
                                <div>
                                    <h2 class="text-2xl font-bold text-white">Name Game</h2>
                                    <h2 class="text-base font-bold mb-4 text-white">Categoria</h2>
                                    <h2 class="text-2xl font-bold mb-4 text-white">Descripcion</h2>
                                    <p class="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae 
                                        tortor ullamcorper, ut vestibulum velit convallis. Aenean posuere risus non velit egestas suscipit. 
                                        Nunc finibus vel ante id euismod. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices 
                                        posuere cubilia Curae; Aliquam erat volutpat. Nulla vulputate pharetra tellus, in luctus risus rhoncus id. 
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>
  
<script>
import axios from "../main";
import { connection } from "../main";
import Navbar from "./navbarComponent.vue";
import Footer from "./FooterComponent.vue";
export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      juego: [],
      reference: "",
      SOL_TO_USD_RATE: 0,
      price: 0,
    };
  },
  async created() {
    await this.getExchange();
    await this.getJuegos();
  },
  methods: {
    async getJuegos() {
      const response = await axios.get("/juegos/" + this.$route.query.id);
      this.juego = response.data;
      console.log(response);
      console.log(this.$route.query.id);
    },
    async getExchange() {
      try {
        const res = await axios.get("/exchange");
        this.SOL_TO_USD_RATE = res.data.sell;
        this.price = this.$router.currentRoute.value.query.price;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.dark {
  background-color: #1a1a1a;
  /* Dark gray background */
}
</style>