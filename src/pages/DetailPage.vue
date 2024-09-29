<template>
  <MainLayout title="Detail">
    <div class="q-pa-md q-gutter-sm">
      <q-card flat bordered>
        <q-card-actions vertical align="left">
          <q-btn flat label="Go to home" to="/home" />
          <q-btn flat label="Go to detail" @click="onClick" />
          <q-btn flat label="Go to about" to="/about" />
          <q-btn
            v-if="appStore.device.capacitor"
            flat
            label="Go to wifi scan"
            to="/wifi-scan"
          />
          <q-btn flat label="Go to barcode scan" to="/barcode-scan" />
          <q-btn flat label="Go to geolocation" to="/geolocation" />
          <q-btn flat label="Go to camera" to="/camera" />
          <q-btn flat label="Go to grid preview" to="/grid-preview" />
          <q-btn flat label="Go to pinch container" to="/pinch-container" />
          <q-btn flat label="Go to pan container" to="/pan-container" />
          <q-btn flat label="Go to video preview" to="/video-preview" />

          <q-btn-dropdown
            flat
            split
            cover
            label="Redirect to google map"
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

          <q-btn flat label="Redirect to speed test" @click="toSpeedTest" />
          <div v-if="url">Speed {{ url.split("=")[1] }}</div>
          <q-btn
            flat
            label="Redirect to video test"
            @click="
              openWebView('https://test-videos.co.uk/bigbuckbunny/mp4-h265')
            "
          />
          <q-btn
            flat
            label="Redirect to ufo test"
            @click="openWebView('https://www.testufo.com/')"
          />
        </q-card-actions>
      </q-card>
    </div>
  </MainLayout>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AppLauncher } from "@capacitor/app-launcher";
import { InAppBrowser } from "@capgo/inappbrowser";
import { useAppStore } from "@/stores/appStore";
import MainLayout from "@/layouts/MainLayout.vue";

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

function openWebView(url) {
  const URLScheme = url;
  if (appStore.device.capacitor) {
    InAppBrowser.openWebView({ url: URLScheme, toolbarType: "blank" });
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
