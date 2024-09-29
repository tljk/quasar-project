<template>
  <MainLayout title="Scan">
    <div class="q-pa-md q-gutter-y-sm">
      <q-card v-for="(item, key) of scanResult" :key="key" flat bordered>
        <q-card-section v-if="scanResult">
          {{ item }}
        </q-card-section>
      </q-card>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          fab
          icon="qr_code_scanner"
          color="primary"
          @click.stop="scanBarcode"
        />
      </q-page-sticky>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { CapacitorBarcodeScanner } from "@capacitor/barcode-scanner";
import MainLayout from "@/layouts/MainLayout.vue";

const $q = useQuasar();

const scanResult = ref([]);
const scanOptions = ref({
  hint: 17,
  scanInstructions: "Please scan a barcode or QRcode",
  scanButton: false,
  scanText: "Scan",
  scanOrientation: 3,
});

async function scanBarcode() {
  await CapacitorBarcodeScanner.scanBarcode(scanOptions.value)
    .then((result) => {
      scanResult.value.push(result);
    })
    .catch((error) => {
      $q.notify({
        message: `Error scanning: ${error.message}`,
      });
    });
}
</script>
