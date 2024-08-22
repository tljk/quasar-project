<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useAppStore } from "@/stores/appStore";
import { getLatestBundle, checkForUpdates } from "./useBundle.js";
import { DarkMode } from "@aparajita/capacitor-dark-mode";
import { LiveUpdate } from "@capawesome/capacitor-live-update";
import { SplashScreen } from "@capacitor/splash-screen";
import { Network } from "@capacitor/network";

const $q = useQuasar();
const appStore = useAppStore();
const appearanceListenerHandle = ref();
const networkListenerHandle = ref();

const lightBackground = "#ffffff";
const darkBackground = "#121212";

const backgroundColor = computed(() =>
  $q.dark.isActive ? darkBackground : lightBackground
);

onMounted(async () => {
  $q.dark.set(await (await DarkMode.isDarkMode()).dark);
  document.body.style.setProperty("--q-dark-page", backgroundColor.value);
  appearanceListenerHandle.value = await DarkMode.addAppearanceListener(
    (value) => {
      $q.dark.set(value.dark);
      document.body.style.setProperty("--q-dark-page", backgroundColor.value);
    }
  );

  if ($q.platform.is.capacitor) {
    await SplashScreen.hide();
    await LiveUpdate.ready();

    appStore.setCurrentBundleId((await LiveUpdate.getBundle()).bundleId);
    appStore.setNetworkStatus(await Network.getStatus());

    networkListenerHandle.value = Network.addListener(
      "networkStatusChange",
      (status) => {
        appStore.setNetworkStatus(status);
        checkForUpdates(appStore.networkStatus?.connectionType == "wifi");
      }
    );

    checkForUpdates(appStore.networkStatus?.connectionType == "wifi");
  }
});
</script>
