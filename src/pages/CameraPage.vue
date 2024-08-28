<template>
  <q-page
    class="fixed-full dark-mode q-pa-md q-gutter-y-sm scroll hide-scrollbar"
  >
    <q-img
      v-if="imageDataUrl"
      :src="imageDataUrl"
      loading="lazy"
      class="full"
      fit="contain"
    />
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add_a_photo" color="primary" @click="takePicture" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { Camera, CameraResultType } from "@capacitor/camera";

const $q = useQuasar();

const imageDataUrl = ref("");
const cameraOptions = ref({
  quality: 90,
  direction: "REAR",
  resultType: CameraResultType.DataUrl,
});

const takePicture = async () => {
  await Camera.getPhoto(cameraOptions.value)
    .then((image) => {
      imageDataUrl.value = image.dataUrl;
    })
    .catch((error) => {
      $q.notify({
        message: `Error taking picture: ${error.message}`,
      });
    });
};
</script>
