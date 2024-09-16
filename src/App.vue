<template>
  <q-layout>
    <q-page-container>
      <router-view v-slot="{ Component, route }">
        <transition
          :enter-active-class="route.meta.enterActiveClass"
          :leave-active-class="route.meta.leaveActiveClass"
          @before-enter="addWillChange"
          @before-leave="addWillChange"
          @after-enter="removeWillChange"
          @after-leave="removeWillChange"
        >
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { PointerListener } from "@/contactjs/contact";
import { useAppStore } from "@/stores/appStore";
import { checkForUpdates } from "./useBundle.js";
import { DarkMode } from "@aparajita/capacitor-dark-mode";
import { LiveUpdate } from "@capawesome/capacitor-live-update";
import { SplashScreen } from "@capacitor/splash-screen";
import { Network } from "@capacitor/network";

const $q = useQuasar();
const appStore = useAppStore();
const appearanceListenerHandle = ref();
const networkListenerHandle = ref();
const pointerListener = ref();

const lightBackground = "#ffffff";
const darkBackground = "#121212";

const backgroundColor = computed(() =>
  $q.dark.isActive ? darkBackground : lightBackground
);

function addWillChange(el) {
  el.style.willChange = "transform, opacity";
}
function removeWillChange(el) {
  el.style.willChange = "auto";
}

onMounted(async () => {
  pointerListener.value = new PointerListener(document.getElementById("q-app"));

  $q.dark.set(await (await DarkMode.isDarkMode()).dark);
  document.body.style.setProperty("--q-dark-page", backgroundColor.value);
  appearanceListenerHandle.value = await DarkMode.addAppearanceListener(
    (value) => {
      $q.dark.set(value.dark);
      document.body.style.setProperty("--q-dark-page", backgroundColor.value);
    }
  );

  appStore.setNetworkStatus(await Network.getStatus());
  networkListenerHandle.value = Network.addListener(
    "networkStatusChange",
    (status) => {
      appStore.setNetworkStatus(status);
    }
  );

  if (appStore.device?.capacitor) {
    await SplashScreen.hide();
    await LiveUpdate.ready();

    appStore.setCurrentBundleId((await LiveUpdate.getBundle()).bundleId);

    checkForUpdates(appStore.networkStatus?.connectionType == "wifi");
  }
});
</script>
