<template>
  <q-page class="fixed-full dark-mode scroll hide-scrollbar">
    <div class="full flex justify-start content-start">
      <img
        v-for="(item, key) of imageDataList"
        :key="key"
        :src="item.webPath"
        :ref="
          (el) => {
            thumbRef[key] = el;
          }
        "
        style="width: 50vw; height: 50vw; object-fit: cover"
        @click="togglePreview(key)"
      />
    </div>

    <div
      class="fullscreen no-pointer-events bg-black"
      style="transition: opacity 0.3s"
      :style="{ opacity: transition ? 1 : 0 }"
    ></div>

    <PanContainer
      class="fullscreen"
      :class="{ 'no-pointer-events': !preview }"
      composable
      :panStyle="panStyle"
      :style="{ opacity: preview ? 1 : 0 }"
      @pan="panDispatchHandler"
      @resize="onResize"
      @containerResize="onContainerResize"
    >
      <PinchContainer
        v-for="(item, key) of imageDataList"
        :key="key"
        composable
        :style="{
          width: $q.screen.width + 'px',
          height: $q.screen.height + 'px',
        }"
        :pinchStyle="pinchContainerList[key]?.pinchStyle"
        @pinch="pinchDispatchHandler"
        @resize="pinchContainerList[key]?.onResize"
        @containerResize="pinchContainerList[key]?.onContainerResize"
        @click="togglePreview(key)"
      >
        <img
          style="max-width: 100%; max-height: 100%; object-fit: cover"
          loading="lazy"
          :src="item.webPath"
          :ref="
            (el) => {
              fullRef[key] = el;
            }
          "
        />
      </PinchContainer>
    </PanContainer>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add_a_photo" color="primary" @click="takePicture" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar, morph } from "quasar";
import { Camera, CameraResultType } from "@capacitor/camera";
import PanContainer from "@/components/PanContainer.vue";
import PinchContainer from "@/components/PinchContainer.vue";
import { usePanContainer } from "@/components/usePanContainer";
import { usePinchContainer } from "@/components/usePinchContainer";

const $q = useQuasar();
const { panStyle, index, handlePan, onResize, onContainerResize, setIndex } =
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
const thumbRef = ref([]);
const fullRef = ref([]);
const transition = ref(false);
const preview = ref(false);

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

function togglePreview(key) {
  const temp = preview.value;
  morph({
    from: preview.value ? fullRef.value[key] : thumbRef.value[key],
    to: preview.value ? thumbRef.value[key] : fullRef.value[key],
    hideFromClone: true,
    keepToClone: true,
    resize: true,
    onToggle: () => {
      if (temp) preview.value = false;
      transition.value = !temp;
      setIndex(key);
    },
    onEnd: () => {
      if (!temp) preview.value = true;
    },
  });
}

onMounted(() => {
  pinchContainerList.value.push(
    usePinchContainer({ maxScaleRatio: 10, minScaleRatio: 0.1 })
  );
  pinchContainerList.value.push(
    usePinchContainer({ maxScaleRatio: 10, minScaleRatio: 0.1 })
  );
  imageDataList.value.push({
    webPath: "https://cdn.quasar.dev/img/parallax1.jpg",
  });
  imageDataList.value.push({
    webPath: "https://cdn.quasar.dev/img/parallax2.jpg",
  });
});
</script>
