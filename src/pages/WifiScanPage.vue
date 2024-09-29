<template>
  <MainLayout title="Wifi">
    <q-pull-to-refresh @refresh="refresh" class="full">
      <div class="q-pa-md q-gutter-y-sm">
        <q-card v-for="(item, key) of wifiList" :key="key" flat bordered>
          <q-card-section> {{ item }} </q-card-section>
        </q-card>
      </div>
    </q-pull-to-refresh>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { Wifi } from "ln-capacitor-wifi";
import MainLayout from "@/layouts/MainLayout.vue";

const $q = useQuasar();

const wifiList = ref(["Pull down to refresh"]);

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
