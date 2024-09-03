<template>
  <q-page class="full" @click="onClick"> </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
function onClick() {
  router.push("/detail");
}
</script>
