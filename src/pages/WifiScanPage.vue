<template>
  <q-page
    class="fixed-full dark-mode q-pa-md q-gutter-y-sm scroll hide-scrollbar"
  >
    <q-pull-to-refresh @refresh="refresh" class="full">
      <q-card v-for="(item, key) of wifiList" :key="key">
        <q-card-section> {{ item }} </q-card-section>
      </q-card>
    </q-pull-to-refresh>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { Wifi } from "ln-capacitor-wifi";

const $q = useQuasar();

const wifiList = ref(["loading..."]);

async function refresh(done) {
  if ($q.platform.is.capacitor) {
    wifiList.value = (await Wifi.scanWifi()).wifis;
  }
  done();
}

onMounted(async () => {
  if ($q.platform.is.capacitor) {
    wifiList.value = (await Wifi.scanWifi()).wifis;
  }
});
</script>
