<template>
  <MainLayout title="About">
    <div class="q-pa-md q-gutter-y-sm">
      <q-card flat bordered>
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
          <q-btn flat label="Update" @click="update"></q-btn>
        </q-card-actions>
        <q-card-actions v-if="appStore.currentBundleId">
          <q-btn flat label="Reset" @click="reset"></q-btn>
        </q-card-actions>
        <q-card-actions
          v-if="
            appStore.device?.platform == 'android' &&
            appStore.upgradeProcess == 'required'
          "
        >
          <q-btn flat label="Upgrade webview" @click="upgradeWebview"></q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </MainLayout>
</template>

<script setup>
import { onMounted } from "vue";
import { useAppStore } from "@/stores/appStore";
import { LiveUpdate } from "@capawesome/capacitor-live-update";
import { CapacitorWebviewUpdate } from "capacitor-webview-update";
import MainLayout from "@/layouts/MainLayout.vue";

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

function reset() {
  if (appStore.quasarMode == "capacitor") {
    LiveUpdate.reset();
  }
}

function upgradeWebview() {
  if (
    appStore.device?.platform == "android" &&
    appStore.upgradeProcess == "required"
  ) {
    CapacitorWebviewUpdate.upgradeWebView();
  }
}

onMounted(() => {
  if (appStore.quasarMode == "pwa") {
    navigator.serviceWorker?.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  }

  if (appStore.device?.platform == "android") {
    CapacitorWebviewUpdate.getCurrentInstruction().then(({ instruction }) => {
      appStore.setInstruction(instruction);
    });
    CapacitorWebviewUpdate.getSystemWebView().then((value) => {
      appStore.setSystemWebview(value);
    });
    CapacitorWebviewUpdate.getUpgradeWebView().then((value) => {
      appStore.setUpgradeWebview(value);
    });
    CapacitorWebviewUpdate.compareVersion().then(({ result }) => {
      if (result < 0) {
        appStore.setUpgradeProcess("required");
      }
    });
    CapacitorWebviewUpdate.addListener("upgradeProcess", ({ percent }) => {
      appStore.setUpgradeProcess((percent * 100).toFixed(2) + "%");
    });
    CapacitorWebviewUpdate.addListener("upgradeError", ({ message }) => {
      if (message == "WebView only can replace before System WebView init") {
        CapacitorWebviewUpdate.applyWebView().then(() => {
          appStore.setUpgradeProcess("ready");
        });
      } else {
        console.error(message);
      }
    });
  }
});
</script>
