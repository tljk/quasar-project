<template>
  <q-page class="fixed-full dark-mode column">
    <q-btn label="Go to Home" to="/home" />
    <q-btn label="Go to Detail" @click="onClick" />
    <q-btn label="About" to="/about" />
    <q-btn label="Go to wifi scan" to="/wifi-scan" />
  </q-page>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

function onClick() {
  router.push("/detail/" + (Number(route.params.id) + 1));
}
</script>
