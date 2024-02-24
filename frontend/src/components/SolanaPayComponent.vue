<template>
  <div class="dark">
    <Navbar />
    <main class="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-900 text-white">
      <div class="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 class="text-2xl font-semibold">Solana Pay Demo</h1>
      </div>
      <div v-if="qr" class="mt-8">
        <div v-html="qr.getHtml()"></div>
      </div>
      <div v-else-if="qrLoading" class="mt-8">
        <p>Loading...</p>
      </div>
      <div v-else class="mt-8">
        <p>No QR code available</p>
      </div>
      <div class="mt-8">
        <button @click="handleGenerateClick" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Generate Solana Pay Order
        </button>
        <button @click="handleVerifyClick" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4">
          Verify Transaction
        </button>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import axios from "../main";
import QRCodeStyling from "qr-code-styling";
import Navbar from './navbarComponent.vue';
import Footer from './FooterComponent.vue';

export default {
  components: {
    Navbar, // Registra el componente Navbar
    Footer // Registra el componente Footer
  },
  data() {
    return {
      reference: "",
      qr: null,
      qrLoading: false,
    };
  },
  methods: {
    async handleGenerateClick() {
      this.qrLoading = true;
      const res = await axios.post("/solana", {
        amount: 0.001,
        currency: "USD",
        description: "Test Payment",
      });
      const { url, ref } = res.data;
      this.reference = ref;
      this.qr = new QRCodeStyling({
        width: 200,
        height: 200,
        data: url,
        image: "",
        dotsOptions: {
          color: "#ffffff",
          type: "rounded",
        },
        backgroundOptions: {
          color: "#333333",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 20,
        },
      });

      this.qr.download({ name: "solana-pay-qr", extension: "svg" })
      this.qrLoading = false;
    },
    async handleVerifyClick() {
      if (!this.reference) {
        alert("Please generate a transaction first");
        return;
      }

      const res = await axios.get(`/solana/${this.reference}`);

      if (res.status == 200) {
        alert("Transaction verified");
        this.qr = undefined;
        this.reference = undefined;
      } else {
        alert("Transaction not found");
      }
    },
  },
};
</script>

<style scoped>
/* Add your custom styles here */
.dark {
  background-color: #1a1a1a; /* Dark gray background */
}
</style>
