<template>
  <div class="bg-gray-900">
    <Navbar />
    <div class="container mx-auto py-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        <div class="col-span-1 sm:col-span-2 lg:col-span-3">
          <div class="bg-gray-800 rounded-lg p-6 shadow-lg relative" style="height: 600px;">
            <!-- Imagen del juego en el fondo con opacidad -->
            <div class="absolute inset-0 bg-cover bg-center" :style="{ 'background-image': 'url(' + juego.imagen + ')', 'opacity': '0.4' }"></div>
            <!-- Contenido del juego y botones -->
            <div class="relative z-10 h-full">
              <h2 class="text-3xl sm:text-4xl font-bold mb-4 text-white">{{ juego.nombre }}</h2>
              <div class="flex justify-between items-center mt-4">
                <span class="text-lg sm:text-xl font-bold text-white">
                  {{ price }} USDT&#8779;${{(price / SOL_TO_USD_RATE).toFixed(9)}} SOL
                </span>
              </div>
              <div class="mt-6">
                <h2 class="text-2xl font-bold mb-4 text-white" v-if="!showQR">Descriptión</h2>
                <p class="text-white text-justify" v-if="!showQR">{{ truncar(juego.descripcion) }}</p>
              </div>
                <div class="flex flex-col items-center justify-between h-full" v-if="showQR">
                <div ref="qrCode"></div>
                </div>
              <!-- Contenedor de los botones con posición absoluta en el borde inferior -->
              <div class="absolute bottom-0 left-0 right-0 p-6 flex justify-center">
                <button @click="handleGenerateClick" :disabled="qrLoading" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded mr-4">
                    {{ qrLoading ? "Generating..." : "Generate Solana Payment Order" }}
                </button>
                <button @click="handleVerifyClick" :disabled="qrLoading" class="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded">
                    Verify Transaction
                </button>
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
import QRCodeStyling from "qr-code-styling";
import Navbar from "./navbarComponent.vue";
import Footer from "./FooterComponent.vue";
import { WalletNotInitializedError, useWallet } from "solana-wallets-vue";
import { createTransfer, CreateTransferError, parseURL } from "@solana/pay";
import { getJuego, getExchange, getUserSession} from "../apis";
import {ref} from 'vue';
import { useRoute } from "vue-router";
import Swal from "sweetalert2";
export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      juego: [],
      reference: "",
      qr: null,
      qrLoading: false,
      SOL_TO_USD_RATE: 0,
      price: 0,
      showQR: false,
    };
  },
  async setup(){
    const juego = ref({});
    const SOL_TO_USD_RATE = ref(50);
    const route = useRoute();
    await Promise.all([getJuego(route.query.id), getExchange()])
      .then((values) => {
        juego.value = values[0];
        SOL_TO_USD_RATE.value = values[1];
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error loading game. Please try again later.",
        });
      });
    return { juego, SOL_TO_USD_RATE, price: juego.value.precio};
  },
  mounted(){
    const hasSession = getUserSession();
    if(!hasSession){
      this.$router.push("/login?id="+this.$route.query.id+"&price="+this.price+"&dir=solanaPay");
    }
  },
  methods: {
    async getJuegos() {
      /*
      try {
        const response = await axios.get("/juegos/" + this.$route.query.id);
        this.juego = response.data;
      } catch (error) {
        console.error(error);
      }*/
      const response = await axios.get("/juegos/" + this.$route.query.id);
      this.juego = response.data;
      console.log(response);
      console.log(this.$route.query.id);
    },
    async handleGenerateClick() {
      this.showQR = true;
      try {
        this.qrLoading = true;
        const res = await axios.post(
          "/solana/pay/" + this.$router.currentRoute.value.query.id,
          {
            amount: this.price / this.SOL_TO_USD_RATE,
            currency: "SOL",
            description: "Solana Pay",
          }
        );
        const { url, ref } = res.data;
        this.reference = ref;
        this.generateQRCode(url);
        this.qrLoading = false;

        await this.makePaymentWithWallet(url);
      } catch (error) {
        console.error("Error generating QR code:", error);
        alert("Error generating QR code. Please try again later.");
      }
      
    },
    truncar(text, maxLength = 2000) {
      return text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
    },
    async handleVerifyClick() {
      if (!this.reference) {
        Swal.fire({
          icon: "warning",
          title: "Warning",
          text: "Please generate a payment order first.",
        });
        return;
      }
      try {
        const res = await axios.get("/solana/pay/" + this.reference);
        if (res.status == 200 || res.status == 201) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Transaction verified successfully.\nYour NFT will be delivered soon.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Transaction verification failed",
          });
        }
      } catch (error) {
        console.error("Error verifying transaction:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Transaction verification failed",
        });
      }
    },
    async makePaymentWithWallet(url) {
      try {
        // Make transaction with wallet
        const { publicKey, sendTransaction } = useWallet();
        if (!publicKey.value) throw new WalletNotInitializedError();

        const { recipient, amount, reference, label, message, memo } =
          parseURL(url);

        const tx = await createTransfer(connection, publicKey.value, {
          recipient,
          amount,
          reference,
          label,
          message,
          memo,
        });
        const signature = await sendTransaction(tx, connection);
        await connection.confirmTransaction(signature, "processed");
        await this.handleVerifyClick();
        console.log("Transaction sent:", signature);
      } catch (error) {
        if(error instanceof CreateTransferError)
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Not enough balance to make the payment. You can also pay scanning the QR code with a Solana wallet.",
          });
        else if(error instanceof WalletNotInitializedError)
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Wallet not initialized. Please try again later.",
          });
        else
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "An error occurred while making the payment",
          });
      }
    },
    generateQRCode(url) {
      this.qr = new QRCodeStyling({
        width: 300,
        height: 300,
        data: url,
        margin: 0,
        qrOptions: {
          typeNumber: "0",
          mode: "Byte",
          errorCorrectionLevel: "Q",
        },
        imageOptions: { hideBackgroundDots: true, imageSize: 0.2, margin: 5 },
        dotsOptions: {
          type: "classy",
          color: "#6a1a4c",
          gradient: {
            type: "linear",
            rotation: 2.356194490192345,
            colorStops: [
              { offset: 0, color: "#0df1a8" },
              { offset: 1, color: "#d823fd" },
            ],
          },
        },
        backgroundOptions: { color: "#333333", gradient: null },
        image:
          "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI0LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAzOTcuNyAzMTEuNyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMzk3LjcgMzExLjc7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDp1cmwoI1NWR0lEXzFfKTt9Cgkuc3Qxe2ZpbGw6dXJsKCNTVkdJRF8yXyk7fQoJLnN0MntmaWxsOnVybCgjU1ZHSURfM18pO30KPC9zdHlsZT4KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8xXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIzNjAuODc5MSIgeTE9IjM1MS40NTUzIiB4Mj0iMTQxLjIxMyIgeTI9Ii02OS4yOTM2IiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgMzE0KSI+Cgk8c3RvcCAgb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBGRkEzIi8+Cgk8c3RvcCAgb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojREMxRkZGIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik02NC42LDIzNy45YzIuNC0yLjQsNS43LTMuOCw5LjItMy44aDMxNy40YzUuOCwwLDguNyw3LDQuNiwxMS4xbC02Mi43LDYyLjdjLTIuNCwyLjQtNS43LDMuOC05LjIsMy44SDYuNQoJYy01LjgsMC04LjctNy00LjYtMTEuMUw2NC42LDIzNy45eiIvPgo8bGluZWFyR3JhZGllbnQgaWQ9IlNWR0lEXzJfIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjI2NC44MjkxIiB5MT0iNDAxLjYwMTQiIHgyPSI0NS4xNjMiIHkyPSItMTkuMTQ3NSIgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDMxNCkiPgoJPHN0b3AgIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IzAwRkZBMyIvPgoJPHN0b3AgIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6I0RDMUZGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjQuNiwzLjhDNjcuMSwxLjQsNzAuNCwwLDczLjgsMGgzMTcuNGM1LjgsMCw4LjcsNyw0LjYsMTEuMWwtNjIuNyw2Mi43Yy0yLjQsMi40LTUuNywzLjgtOS4yLDMuOEg2LjUKCWMtNS44LDAtOC43LTctNC42LTExLjFMNjQuNiwzLjh6Ii8+CjxsaW5lYXJHcmFkaWVudCBpZD0iU1ZHSURfM18iIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMzEyLjU0ODQiIHkxPSIzNzYuNjg4IiB4Mj0iOTIuODgyMiIgeTI9Ii00NC4wNjEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgMCAzMTQpIj4KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiMwMEZGQTMiLz4KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNEQzFGRkYiLz4KPC9saW5lYXJHcmFkaWVudD4KPHBhdGggY2xhc3M9InN0MiIgZD0iTTMzMy4xLDEyMC4xYy0yLjQtMi40LTUuNy0zLjgtOS4yLTMuOEg2LjVjLTUuOCwwLTguNyw3LTQuNiwxMS4xbDYyLjcsNjIuN2MyLjQsMi40LDUuNywzLjgsOS4yLDMuOGgzMTcuNAoJYzUuOCwwLDguNy03LDQuNi0xMS4xTDMzMy4xLDEyMC4xeiIvPgo8L3N2Zz4K",
        dotsOptionsHelper: {
          colorType: { single: true, gradient: false },
          gradient: {
            linear: true,
            radial: false,
            color1: "#6a1a4c",
            color2: "#6a1a4c",
            rotation: "0",
          },
        },
        cornersSquareOptions: {
          type: "extra-rounded",
          color: "#000000",
          gradient: {
            type: "linear",
            rotation: 2.356194490192345,
            colorStops: [
              { offset: 0, color: "#0df1a8" },
              { offset: 1, color: "#d823fd" },
            ],
          },
        },
        cornersSquareOptionsHelper: {
          colorType: { single: true, gradient: false },
          gradient: {
            linear: true,
            radial: false,
            color1: "#000000",
            color2: "#000000",
            rotation: "0",
          },
        },
        cornersDotOptions: {
          type: "square",
          color: "#7b3d60",
          gradient: {
            type: "linear",
            rotation: 2.356194490192345,
            colorStops: [
              { offset: 0, color: "#0df1a8" },
              { offset: 1, color: "#d823fd" },
            ],
          },
        },
        cornersDotOptionsHelper: {
          colorType: { single: true, gradient: false },
          gradient: {
            linear: true,
            radial: false,
            color1: "#000000",
            color2: "#000000",
            rotation: "0",
          },
        },
        backgroundOptionsHelper: {
          colorType: { single: true, gradient: false },
          gradient: {
            linear: true,
            radial: false,
            color1: "#ffffff",
            color2: "#ffffff",
            rotation: "0",
          },
        },
      });
      /*this.qr.download({
        name: "solana-pay-qr",
        extension: "svg",
      })*/
      this.$nextTick(() => {
        if (this.$refs.qrCode) {
          // Remove any existing images
          while (this.$refs.qrCode.childNodes.length > 0) {
            this.$refs.qrCode.removeChild(this.$refs.qrCode.childNodes[0]);
          }
          // Append the new image
          this.qr.append(this.$refs.qrCode);
        }
      });
    },
    clearQRCode() {
      if (this.qr) {
        this.qr.clear();
        this.qr = null;
      }
      this.reference = "";
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