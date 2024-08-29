<template>
  <q-page
    class="fixed-full dark-mode q-pa-md q-gutter-sm scroll hide-scrollbar"
  >
    <q-btn label="Go to home" to="/home" />
    <q-btn label="Go to detail" @click="onClick" />
    <q-btn label="Go to about" to="/about" />
    <q-btn label="Go to wifi scan" to="/wifi-scan" />
    <q-btn label="Go to barcode scan" to="/barcode-scan" />
    <q-btn label="Go to geolocation" to="/geolocation" />
    <q-btn label="Go to camera" to="/camera" />
    <q-btn label="Redirect to speed test" @click="toSpeedTest" />
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
  </q-page>
</template>

<script setup>
import { ref } from "vue";
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

function onClick() {
  router.push("/detail/" + (Number(route.params.id) + 1));
}

function toSpeedTest() {
  const URLScheme = "https://speedtest.net";
  if (appStore.device.capacitor) {
    InAppBrowser.openWebView({ url: URLScheme, toolbarType: "blank" });
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
</script>
