<template>
  <q-page class="fixed-full dark-mode">
    <q-card>
      <q-card-section v-if="appStore.version">
        Current version: {{ appStore.version }}
      </q-card-section>
      <q-card-section v-if="appStore.currentBundleId">
        Current bundle: {{ appStore.currentBundleId }}
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
      <q-card-section v-if="appStore.serviceWorker.ready">
        Service worker: {{ appStore.serviceWorker }}
      </q-card-section>

      <q-card-actions>
        <q-btn label="Check update" @click="onClick"></q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { useAppStore } from "@/stores/appStore";
import { LiveUpdate } from "@capawesome/capacitor-live-update";

const appStore = useAppStore();

async function onClick() {
  if (appStore.environment == "android") await LiveUpdate.reload();
}
</script>
