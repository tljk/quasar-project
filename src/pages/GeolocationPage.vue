<template>
  <q-page class="fixed-full dark-mode">
    <q-card v-for="(item, key) of geolocationResult" :key="key">
      <q-card-section v-if="geolocationResult">
        {{ item }}
      </q-card-section>
    </q-card>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="gps_fixed" color="primary" @click="getGeolocation" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { Geolocation } from "@capacitor/geolocation";

const $q = useQuasar();

const geolocationResult = ref([]);
const geolocationOptions = ref({
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
});

async function getGeolocation() {
  $q.loading.show();
  await Geolocation.getCurrentPosition(geolocationOptions.value)
    .then((result) => {
      geolocationResult.value.push(result);
    })
    .catch((error) => {
      $q.notify({
        message: `Error getting geolocation: ${error.message}`,
      });
    });
  $q.loading.hide();
}
</script>
