<template>
  <q-page class="fixed-full dark-mode scroll hide-scrollbar">
    <PanContainer :size="imageDataList.length" class="full">
      <q-page class="full" v-for="(item, key) of imageDataList" :key="key">
        <ImagePreview :src="item.webPath" />
      </q-page>
    </PanContainer>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add_a_photo" color="primary" @click="takePicture" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { Camera, CameraResultType } from "@capacitor/camera";
import PanContainer from "@/components/PanContainer.vue";
import ImagePreview from "src/components/PinchContainer.vue";

const $q = useQuasar();

const imageDataList = ref([]);
const cameraOptions = ref({
  quality: 90,
  direction: "REAR",
  resultType: CameraResultType.Uri,
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
