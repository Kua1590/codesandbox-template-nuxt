<template>
  <div>
    <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="Student QR Code" />
    <canvas v-else ref="qrCanvas"></canvas>
  </div>
</template>

<script>
import QRCode from 'qrcode';

export default {
  props: {
    studentIdentifier: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      qrCodeDataUrl: null
    };
  },
  methods: {
    async generateQRCode() {
      if (!this.studentIdentifier) {
        this.qrCodeDataUrl = null;
        return;
      }
      try {
        // Using toDataURL for image src binding
        this.qrCodeDataUrl = await QRCode.toDataURL(this.studentIdentifier, { errorCorrectionLevel: 'H' });

        // Alternatively, to draw on canvas (if not using img src):
        // const canvas = this.$refs.qrCanvas;
        // if (canvas) {
        //   await QRCode.toCanvas(canvas, this.studentIdentifier, { errorCorrectionLevel: 'H' });
        //   this.qrCodeDataUrl = canvas.toDataURL(); // Optional: if you still want a data URL for other uses
        // }
      } catch (error) {
        console.error('Failed to generate QR code:', error);
        this.qrCodeDataUrl = null; // Clear previous QR code on error
      }
    }
  },
  mounted() {
    this.generateQRCode();
  },
  watch: {
    studentIdentifier: {
      handler: 'generateQRCode',
      immediate: true // Also call when the component is mounted and identifier is initially set
    }
  }
};
</script>

<style scoped>
img {
  max-width: 200px; /* Adjust as needed */
  height: auto;
  border: 1px solid #eee; /* Optional: adds a border around the QR code */
}
canvas {
  display: block; /* Ensures canvas is not inline, helps with layout */
  max-width: 200px;
  height: auto;
  border: 1px solid #eee;
}
</style>
