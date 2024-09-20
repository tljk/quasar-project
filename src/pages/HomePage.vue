<template>
  <q-page class="fixed-full dark-mode scroll hide-scrollbar">
    <div class="q-pa-md q-gutter-y-sm">
      <q-card flat bordered>
        <q-card-section>
          This page has been activated {{ count }} times.
        </q-card-section>
        <q-card-action>
          <q-btn flat label="Go to Detail" to="/detail" />
        </q-card-action>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onActivated } from "vue";

const count = ref(0);

onActivated(() => {
  count.value++;
});
</script>
