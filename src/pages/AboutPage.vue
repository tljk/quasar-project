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

        <q-card-actions v-if="appStore.device?.nativeMobile">
          <q-btn label="Check update" @click="onClick"></q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { useAppStore } from "@/stores/appStore";
import { LiveUpdate } from "@capawesome/capacitor-live-update";

const appStore = useAppStore();

async function onClick() {
  await LiveUpdate.reload();
}
</script>
