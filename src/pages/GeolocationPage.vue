<template>
  <q-page class="fixed-full dark-mode scroll hide-scrollbar">
    <div class="q-pa-md q-gutter-y-sm">
      <q-card v-for="(item, key) of geolocationResult" :key="key" flat bordered>
        <q-card-section v-if="geolocationResult">
          {{ item }}
        </q-card-section>
      </q-card>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          fab
          icon="gps_fixed"
          color="primary"
          :loading="loading"
          @click="getGeolocation"
        />
      </q-page-sticky>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { Geolocation } from "@capacitor/geolocation";

const $q = useQuasar();
const loading = ref(false);

const geolocationResult = ref([]);
const geolocationOptions = ref({
  enableHighAccuracy: true,
  timeout: 30000,
  maximumAge: 0,
});

async function getGeolocation() {
  loading.value = true;
  await Geolocation.getCurrentPosition(geolocationOptions.value)
    .then((result) => {
      geolocationResult.value.push(result);
    })
    .catch((error) => {
      $q.notify({
        message: `Error getting geolocation: ${error.message}`,
      });
    });
  loading.value = false;
}
</script>
