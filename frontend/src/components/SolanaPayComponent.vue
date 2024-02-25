<template>
  <div class="bg-gray-900">
    <Navbar />
    <main class="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-900 text-white">
      <div class="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <h1 class="text-2xl font-semibold">Solana Pay Demo</h1>
      </div>
      <div v-if="qr" class="mt-8">
        <div ref="qrCode"></div>
      </div>
      <div v-else-if="qrLoading" class="mt-8">
        <p>Loading...</p>
      </div>
      <div v-else class="mt-8">
        <p>No QR code available</p>
      </div>
      <div class="mt-8">
        <button @click="handleGenerateClick" :disabled="qrLoading" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {{ qrLoading ? 'Generating...' : 'Generate Solana Pay Order' }}
        </button>
        <button @click="handleVerifyClick" :disabled="qrLoading || !reference" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4">
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
    Navbar,
    Footer
  },
  data() {
    return {
      reference: "",
      qr: null,
      qrLoading: false
    };
  },
  methods: {
    async handleGenerateClick() {
      try {
        this.qrLoading = true;
        const res = await axios.post("/solana/" + this.$router.currentRoute.value.query.id, {
          amount: 0.001,
          currency: "USD",
          description: "Test Payment",
        });
        const { url, ref } = res.data;
        this.reference = ref;
        this.generateQRCode(url);
      } catch (error) {
        console.error("Error generating QR code:", error);
        alert("Error generating QR code. Please try again later.");
      } finally {
        this.qrLoading = false;
      }
    },
    async handleVerifyClick() {
      if (!this.reference) {
        alert("Please generate a transaction first");
        return;
      }

      try {
        const res = await axios.get(`/solana/${this.reference}`);
        if (res.status == 200 || res.status == 201) {
          alert("Transaction verified");
          this.clearQRCode();
        } else {
          alert("Transaction not found");
        }
      } catch (error) {
        console.error("Error verifying transaction:", error);
        alert("Error verifying transaction. Please try again later.");
      }
    },
    generateQRCode(url) {
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
      this.qr.download({
        name: "solana-pay-qr",
        extension: "svg",
      })
      this.qr.append(this.$refs.qrCode);
    },
    clearQRCode() {
      if (this.qr) {
        this.qr.clear();
        this.qr = null;
      }
      this.reference = "";
    }
  }
};
</script>

<style scoped>
.dark {
  background-color: #1a1a1a; /* Dark gray background */
}
</style>
