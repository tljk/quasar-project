<template>
  <q-page class="fixed-full dark-mode">
    <q-card v-for="(item, key) of scanResult" :key="key">
      <q-card-section v-if="scanResult">
        {{ item }}
      </q-card-section>
    </q-card>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="qr_code_scanner" color="primary" @click="scanBarcode" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useAppStore } from "src/stores/appStore";
import { CapacitorBarcodeScanner } from "@capacitor/barcode-scanner";

const $q = useQuasar();
const appStore = useAppStore();

const scanResult = ref([]);
const scanOptions = ref({
  hint: "ALL",
  scanInstructions: "Please scan a barcode or QRcode",
  scanButton: false,
  scanText: "Scan",
  cameraDirection: 1,
  scanOrientation: 3,
});

async function scanBarcode() {
  if (appStore.device.nativeMobile) {
    await CapacitorBarcodeScanner.scanBarcode(scanOptions.value)
      .then((result) => {
        scanResult.value.push(result);
      })
      .catch((error) => {
        $q.notify({
          message: `Error scanning: ${error.message}`,
        });
      });
  } else {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(async () => {
        await CapacitorBarcodeScanner.scanBarcode(scanOptions.value).then(
          (result) => {
            scanResult.value.push(result);
          }
        );
      })
      .catch((error) => {
        $q.notify({
          message: `Error scanning: ${error.message}`,
        });
      });
  }
}
</script>
