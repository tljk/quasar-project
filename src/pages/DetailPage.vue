<template>
  <q-page class="fixed-full dark-mode">
    <q-btn label="Go to Home" to="/home" />
    <q-btn label="Go to Detail" @click="onClick" />
    <q-btn label="About" to="/about" />

    <q-card v-for="(item, key) of wifiList" :key="key">
      <q-card-section> {{ item }} </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { Wifi } from "ln-capacitor-wifi";

const route = useRoute();
const router = useRouter();
const $q = useQuasar();

const wifiList = ref(["loading..."]);

function onClick() {
  router.push("/detail/" + (Number(route.params.id) + 1));
}

onMounted(async () => {
  if ($q.platform.is.capacitor) {
    wifiList.value = (await Wifi.scanWifi()).wifis;
  }
});
</script>
