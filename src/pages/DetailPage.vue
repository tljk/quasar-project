<template>
  <q-page class="fixed-full dark-mode">
    <q-btn label="Go to Home" to="/home" />
    <q-btn label="Go to Detail" @click="onClick" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

function onClick() {
  router.push("/detail/" + (Number(route.params.id) + 1));
}

onMounted(() => {
  console.log("Detail Page Mounted");
});
</script>
