<template>
  <q-page class="full dark-mode scroll hide-scrollbar">
    <SwipeTab :size="imageDataList.length" class="full">
      <q-page class="full" v-for="(item, key) of imageDataList" :key="key">
        {{ key }}
        <q-img :src="item.dataUrl" loading="lazy" class="full" fit="contain" />
      </q-page>
    </SwipeTab>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add_a_photo" color="primary" @click="takePicture" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { Camera, CameraResultType } from "@capacitor/camera";
import SwipeTab from "@/components/SwipeTab.vue";

const $q = useQuasar();

const imageDataList = ref([]);
const cameraOptions = ref({
  quality: 90,
  direction: "REAR",
  resultType: CameraResultType.DataUrl,
});

const takePicture = async () => {
  await Camera.getPhoto(cameraOptions.value)
    .then((image) => {
      imageDataList.value.push(image);
    })
    .catch((error) => {
      $q.notify({
        message: `Error taking picture: ${error.message}`,
      });
    });
};
</script>
