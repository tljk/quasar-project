<template>
  <q-page class="fixed-full dark-mode">
    <q-card>
      <q-card-section v-if="version">
        Current version: {{ version }}
      </q-card-section>
      <q-card-section v-if="currentBundleId">
        Current bundle: {{ currentBundleId }}
      </q-card-section>

      <q-card-actions>
        <q-btn label="Check update" @click="onClick"></q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { LiveUpdate } from "@capawesome/capacitor-live-update";

const $q = useQuasar();

const version = ref();
const currentBundleId = ref();

async function onClick() {
  await LiveUpdate.reload();
}

onMounted(async () => {
  version.value = process.env.APP_VERSION;
  if ($q.platform.is.capacitor) {
    currentBundleId.value = (await LiveUpdate.getBundle()).bundleId;
  }
});
</script>
