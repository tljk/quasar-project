<template>
  <router-view v-slot="{ Component, route }">
    <transition
      :enter-active-class="route.meta.enterActiveClass"
      :leave-active-class="route.meta.leaveActiveClass"
    >
      <keep-alive
        :include="routeStore.cachedViews"
        :max="Number.MAX_SAFE_INTEGER"
      >
        <component :is="replaceName(Component, route)" :key="route.path" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { PointerListener } from "@/contactjs/contact";
import { useAppStore } from "@/stores/appStore";
import { useRouteStore } from "@/stores/routeStore";
import { checkForUpdates } from "./useBundle.js";
import { DarkMode } from "@aparajita/capacitor-dark-mode";
import { LiveUpdate } from "@capawesome/capacitor-live-update";
import { Network } from "@capacitor/network";

const $q = useQuasar();
const appStore = useAppStore();
const routeStore = useRouteStore();
const appearanceListenerHandle = ref();
const networkListenerHandle = ref();
const pointerListener = ref();

const lightBackground = "#f4f4f4";
const darkBackground = "#121212";

const backgroundColor = computed(() =>
  $q.dark.isActive ? darkBackground : lightBackground
);

function replaceName(component, route) {
  if (component) {
    component.type.__name = route.path;
    return component;
  }
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
    await LiveUpdate.ready();

    appStore.setCurrentBundleId((await LiveUpdate.getBundle()).bundleId);

    checkForUpdates(appStore.networkStatus?.connectionType == "wifi");
  }
});
</script>
