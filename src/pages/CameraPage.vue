<template>
  <MainLayout title="Camera" v-model="offset">
    <PanContainer
      class="full"
      composable
      :panStyle="panContainer?.panStyle"
      @pan="panDispatchHandler"
      @resize="panContainer?.onResize"
      @containerResize="panContainer?.onContainerResize"
    >
      <div :style="padStyle"></div>
      <PinchContainer
        v-for="item of virtualDataList"
        :key="item.index"
        composable
        :style="style"
        :pinchStyle="
          panContainer?.index == item.index
            ? pinchContainer?.pinchStyle
            : defaultPinchStyle
        "
        @pinch="pinchDispatchHandler"
        @resize="pinchContainer?.onResize"
        @containerResize="
          (size) => {
            resizeDispatchHandler(size, item.index);
          }
        "
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
import { ref, computed, watch } from "vue";
import { useQuasar } from "quasar";
import { Camera, CameraResultType } from "@capacitor/camera";
import PanContainer from "@/components/PanContainer.vue";
import PinchContainer from "@/components/PinchContainer.vue";
import { usePanContainer } from "@/components/usePanContainer";
import { usePinchContainer } from "@/components/usePinchContainer";
import MainLayout from "@/layouts/MainLayout.vue";

const $q = useQuasar();
const panContainer = ref(
  usePanContainer({
    index: 0,
    vertical: false,
    distanceThreshold: 0.6,
    velocityThreshold: 0.3,
  })
);
const imageDataList = ref([]);
const cameraOptions = ref({
  quality: 90,
  direction: "REAR",
  resultType: CameraResultType.Uri,
});
const pinchContainer = ref(
  usePinchContainer({
    maxScaleRatio: 10,
    minScaleRatio: 0.1,
  })
);
const pinchContainerSizeList = ref({});
const defaultPinchStyle = ref({
  transform: "scale(1) translate(0px, 0px)",
  transition: "transform 0.3s",
});
const panOption = ref(false);
const pinching = ref(false);
const offset = ref();
const style = computed(() => ({
  width: $q.screen.width + "px",
  height: $q.screen.height - offset.value + "px",
}));
const padStyle = computed(() => {
  return {
    width: `${$q.screen.width * Math.max(0, panContainer.value?.index - 1)}px`,
    height: `${$q.screen.height}px`,
  };
});
const virtualDataList = computed(() => {
  return imageDataList.value
    .slice(
      Math.max(0, panContainer.value?.index - 1),
      panContainer.value?.index + 2
    )
    .map((item, index) => {
      return {
        ...item,
        index: Math.max(0, panContainer.value?.index - 1) + index,
      };
    });
});

watch(
  () => panContainer.value?.index,
  () => {
    resetPinchContainer();
  }
);

async function takePicture() {
  await Camera.getPhoto(cameraOptions.value)
    .then((image) => {
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
  const borderReached = pinchContainer.value?.borderReached;
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
    panContainer.value?.handlePan(event);
  } else {
    pinchContainer.value?.handlePan(event);
  }

  if (event.type == "panend") {
    panOption.value = false;
  }
}

function pinchDispatchHandler(event) {
  if (event.type == "pinchstart") {
    pinching.value = true;
  }
  pinchContainer.value?.handlePinch(event);
  if (event.type == "pinchend") {
    pinching.value = false;
  }
}

function resizeDispatchHandler(size, key) {
  pinchContainerSizeList.value[key] = size;
  if (key == panContainer.value?.index) {
    pinchContainer.value?.onContainerResize(size);
  }
}

function resetPinchContainer() {
  pinchContainer.value?.setScaleRatio(1);
  pinchContainer.value?.setOffsetX(0);
  pinchContainer.value?.setOffsetY(0);
  if (pinchContainerSizeList.value[panContainer.value?.index]) {
  pinchContainer.value?.onContainerResize(
    pinchContainerSizeList.value[panContainer.value?.index]
  );
  }
}
</script>
