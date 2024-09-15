<template>
  <q-page class="fixed-full dark-mode scroll hide-scrollbar">
    <div class="q-pa-md q-gutter-y-sm">
      <q-card>
        <q-card-section v-if="appStore.version">
          Current version: {{ appStore.version }}
        </q-card-section>
        <q-card-section v-if="appStore.currentBundleId">
          Current bundle: {{ appStore.currentBundleId }}
        </q-card-section>
        <q-card-section v-if="appStore.latestBundle">
          Latest bundle: {{ appStore.latestBundle }}
        </q-card-section>
        <q-card-section v-if="appStore.quasarMode">
          Current mode: {{ appStore.quasarMode }}
        </q-card-section>
        <q-card-section v-if="appStore.environment">
          Current environment: {{ appStore.environment }}
        </q-card-section>
        <q-card-section v-if="appStore.device">
          Current device: {{ appStore.device }}
        </q-card-section>
        <q-card-section v-if="appStore.serviceWorker">
          Service worker: {{ appStore.serviceWorker }}
        </q-card-section>
        <q-card-section v-if="appStore.networkStatus">
          Network status: {{ appStore.networkStatus }}
        </q-card-section>
        <q-card-section v-if="appStore.instruction">
          Instruction: {{ appStore.instruction }}
        </q-card-section>
        <q-card-section v-if="appStore.systemWebview">
          System webview: {{ appStore.systemWebview }}
        </q-card-section>
        <q-card-section v-if="appStore.upgradeWebview">
          Upgrade webview: {{ appStore.upgradeWebview }}
        </q-card-section>
        <q-card-section v-if="appStore.upgradeProcess">
          Upgrade process: {{ appStore.upgradeProcess }}
        </q-card-section>

        <q-card-actions
          v-if="appStore.nextBundleId || appStore.serviceWorker?.updatefound"
        >
          <q-btn label="Update" @click="update"></q-btn>
        </q-card-actions>
        <q-card-actions v-if="appStore.currentBundleId">
          <q-btn label="Reset" @click="LiveUpdate.reset()"></q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from "vue";
import { useAppStore } from "@/stores/appStore";
import { LiveUpdate } from "@capawesome/capacitor-live-update";
import { CapacitorWebviewUpdate } from "capacitor-webview-update";

const appStore = useAppStore();

function update() {
  if (appStore.quasarMode == "pwa") {
    navigator.serviceWorker?.ready.then((registration) => {
      registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    });
  } else if (appStore.quasarMode == "capacitor") {
    LiveUpdate.checkForUpdate();
  }
}

onMounted(() => {
  navigator.serviceWorker?.addEventListener("controllerchange", () => {
    window.location.reload();
  });
  CapacitorWebviewUpdate.getCurrentInstruction().then(({ instruction }) => {
    appStore.setInstruction(instruction);
  });
  CapacitorWebviewUpdate.getSystemWebView().then((value) => {
    appStore.setSystemWebview(value);
  });
  CapacitorWebviewUpdate.getUpgradeWebView().then((value) => {
    appStore.setUpgradeWebview(value);
  });
});
</script>
