<template>
  <q-page class="fixed-full dark-mode scroll hide-scrollbar">
    <div class="q-pa-md q-gutter-sm">
      <q-btn label="Go to home" to="/home" />
      <q-btn label="Go to detail" @click="onClick" />
      <q-btn label="Go to about" to="/about" />
      <q-btn label="Go to wifi scan" to="/wifi-scan" />
      <q-btn label="Go to barcode scan" to="/barcode-scan" />
      <q-btn label="Go to geolocation" to="/geolocation" />
      <q-btn label="Go to camera" to="/camera" />
      <q-btn label="Go to pinch container" to="/pinch-container" />
      <q-btn label="Go to pan container" to="/pan-container" />
      <q-btn label="Redirect to speed test" @click="toSpeedTest" />
      <div v-if="url">Speed {{ url.split("=")[1] }}</div>
      <q-btn-dropdown
        label="Redirect to google map"
        split
        cover
        @click="toGoogleMap"
      >
        <q-list>
          <q-item>
            <q-item-section>
              <q-input v-model="latitude" label="latitude" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-input v-model="longitude" label="longitude" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AppLauncher } from "@capacitor/app-launcher";
import { InAppBrowser } from "@capgo/inappbrowser";
import { useQuasar } from "quasar";
import { useAppStore } from "@/stores/appStore";

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();

const latitude = ref(37);
const longitude = ref(-122);
const url = ref("");

function onClick() {
  router.push("/detail/" + (Number(route.params.id) + 1));
}

async function toSpeedTest() {
  const URLScheme = "https://speedtest.net";
  if (appStore.device.capacitor) {
    await InAppBrowser.openWebView({ url: URLScheme, toolbarType: "blank" });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await InAppBrowser.executeScript({
      code: `
        new MutationObserver((_, obs) => {
          const download = document.querySelector(".download-speed").textContent;
          if (download && download != "000" && download != "—") {
            window.location.href="https://www.speedtest.net/#/download="+download;
          }
        }).observe(document, { childList: true, subtree: true });
      `,
    });
  } else {
    window.open(URLScheme, "_blank");
  }
}

function toGoogleMap() {
  const URLScheme = `https://www.google.com/maps/dir/?api=1&destination=${latitude.value},${longitude.value}`;
  if (appStore.device.capacitor) {
    AppLauncher.canOpenUrl({
      url: "com.google.android.apps.maps",
    }).then(async (res) => {
      if (res.value) {
        AppLauncher.openUrl({
          url: URLScheme,
        });
      } else {
        InAppBrowser.openWebView({ url: URLScheme, toolbarType: "blank" });
      }
    });
  } else {
    window.open(URLScheme, "_blank");
  }
}

onMounted(() => {
  if (appStore.device.capacitor) {
    InAppBrowser.addListener("urlChangeEvent", (event) => {
      url.value = event.url;
    });
  }
});
</script>
