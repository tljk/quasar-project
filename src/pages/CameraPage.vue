<template>
  <MainLayout title="Camera" v-model="offset">
    <PanContainer
      class="full"
      composable
      :panStyle="panStyle"
      @pan="panDispatchHandler"
      @resize="onResize"
      @containerResize="onContainerResize"
    >
      <PinchContainer
        v-for="(item, key) of imageDataList"
        :key="key"
        composable
        :style="style"
        :pinchStyle="pinchContainerList[key]?.pinchStyle"
        @pinch="pinchDispatchHandler"
        @resize="pinchContainerList[key]?.onResize"
        @containerResize="pinchContainerList[key]?.onContainerResize"
      >
        <img
          class="full fit-cover block no-pointer-events"
          loading="lazy"
          :src="item.webPath"
        />
      </PinchContainer>
    </PanContainer>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add_a_photo" color="primary" @click.stop="takePicture" />
    </q-page-sticky>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { Camera, CameraResultType } from "@capacitor/camera";
import PanContainer from "@/components/PanContainer.vue";
import PinchContainer from "@/components/PinchContainer.vue";
import { usePanContainer } from "@/components/usePanContainer";
import { usePinchContainer } from "@/components/usePinchContainer";
import MainLayout from "@/layouts/MainLayout.vue";

const $q = useQuasar();
const { panStyle, index, handlePan, onResize, onContainerResize } =
  usePanContainer({
    index: 0,
    vertical: false,
    distanceThreshold: 0.6,
    velocityThreshold: 0.3,
  });
const imageDataList = ref([]);
const cameraOptions = ref({
  quality: 90,
  direction: "REAR",
  resultType: CameraResultType.Uri,
});
const pinchContainerList = ref([]);
const panOption = ref(false);
const pinching = ref(false);
const offset = ref();
const style = computed(() => ({
  width: $q.screen.width + "px",
  height: $q.screen.height - offset.value + "px",
}));

async function takePicture() {
  await Camera.getPhoto(cameraOptions.value)
    .then((image) => {
      pinchContainerList.value.push(
        usePinchContainer({ maxScaleRatio: 10, minScaleRatio: 0.1 })
      );
      imageDataList.value.push(image);
    })
    .catch((error) => {
      $q.notify({
        message: `Error taking picture: ${error.message}`,
      });
    });
}

function panDispatchHandler(event) {
  if (pinching.value) return;
  const borderReached = pinchContainerList.value[index.value]?.borderReached;
  if (borderReached && event.type == "panstart") {
    if (
      (borderReached.top && event.detail.live.direction == "down") ||
      (borderReached.bottom && event.detail.live.direction == "up") ||
      (borderReached.left && event.detail.live.direction == "right") ||
      (borderReached.right && event.detail.live.direction == "left")
    ) {
      panOption.value = true;
    } else {
      panOption.value = false;
    }
  }

  if (panOption.value) {
    handlePan(event);
  } else {
    pinchContainerList.value[index.value]?.handlePan(event);
  }

  if (event.type == "panend") {
    panOption.value = false;
  }
}

function pinchDispatchHandler(event) {
  if (event.type == "pinchstart") {
    pinching.value = true;
  }
  pinchContainerList.value[index.value]?.handlePinch(event);
  if (event.type == "pinchend") {
    pinching.value = false;
  }
}
</script>
