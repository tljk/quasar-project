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
import { DarkMode } from "@aparajita/capacitor-dark-mode";
import { LiveUpdate } from "@capawesome/capacitor-live-update";

const $q = useQuasar();
const appearanceListenerHandle = ref(null);

const lightBackground = "#ffffff";
const darkBackground = "#121212";

const backgroundColor = computed(() =>
  $q.dark.isActive ? darkBackground : lightBackground
);

onMounted(async () => {
  await LiveUpdate.ready();

  $q.dark.set(await (await DarkMode.isDarkMode()).dark);
  document.body.style.setProperty("--q-dark-page", backgroundColor.value);
  appearanceListenerHandle.value = await DarkMode.addAppearanceListener(
    (value) => {
      $q.dark.set(value.dark);
      document.body.style.setProperty("--q-dark-page", backgroundColor.value);
    }
  );
});
</script>
