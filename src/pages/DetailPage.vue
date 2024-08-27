<template>
  <q-page class="fixed-full dark-mode column">
    <q-btn label="Go to Home" to="/home" />
    <q-btn label="Go to Detail" @click="onClick" />
    <q-btn label="About" to="/about" />
    <q-btn label="Go to wifi scan" to="/wifi-scan" />
    <q-btn label="Redirect" @click="onRedirect" />
    <q-btn label="Go to Barcode Scan" to="/barcode-scan" />
  </q-page>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { InAppBrowser, DefaultWebViewOptions } from "@capacitor/inappbrowser";
import { useAppStore } from "@/stores/appStore";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

function onClick() {
  router.push("/detail/" + (Number(route.params.id) + 1));
}

async function onRedirect() {
  if (appStore.device.capacitor) {
    await InAppBrowser.openInWebView({
      url: "https://speedtest.net",
      options: DefaultWebViewOptions,
    });
  } else {
    window.open("https://speedtest.net", "_blank");
  }
}
</script>
