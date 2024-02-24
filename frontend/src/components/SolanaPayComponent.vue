<template>
  <main class="flex min-h-screen flex-col items-center justify-between p-24">
    <div
      class="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex"
    >
      <h1 class="text-2xl font-semibold">Solana Pay Demo</h1>
    </div>
    <!-- <Image src="" alt="QR Code" width="{200}" height="{200}" priority /> -->
    <div v-if="qr">
      <div v-html="qr.getHtml()"></div>
    </div>
    <div v-else-if="qrLoading">
      LOADING
      </div>
    <div v-else>
      QR NO EXISTE
      </div>
    <div>
      <button @click="handleGenerateClick">Generate Solana Pay Order</button>
      <button @click="handleVerifyClick">Verify Transaction</button>
    </div>
  </main>
</template>

<script>
import axios from "../main";
import QRCodeStyling from "qr-code-styling";
export default {
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
          color: "#000",
          type: "rounded",
        },
        backgroundOptions: {
          color: "#fff",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 20,
        },
      });

      this.qr.download({ name: "solana-pay-qr" , extension: "svg" })
      this.qrLoading = false;

    //   const qrBlob = await qr.getRawData("png");
    //   if (!qrBlob) {
    //     alert("Error generating QR");
    //     return;
    //   }
    //   reader.readAsDataURL(qrBlob);

    //   setReference(ref);
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

<style>
/* Add your custom styles here */
</style>
