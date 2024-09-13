<template>
  <q-page
    class="fixed-full dark-mode scroll hide-scrollbar flex justify-start content-start"
  >
    <div
      v-tap="() => togglePreview(key)"
      v-for="(item, key) of imageDataList"
      :key="key"
      style="width: 50vw; height: 50vw"
    >
      <img
        class="full fit-cover"
        :src="item.webPath"
        :ref="
          (el) => {
            thumbRef[key] = el;
          }
        "
      />
    </div>

    <div
      class="fullscreen no-pointer-events bg-black"
      style="transition: opacity 0.3s"
      :style="{ opacity: dimmed ? 1 : 0 }"
    ></div>

    <PanContainer
      class="fullscreen"
      :class="{ 'no-pointer-events': !showPreview }"
      composable
      :panStyle="panContainer?.panStyle"
      :style="{ opacity: showPreview ? 1 : 0 }"
      @pan="panDispatchHandler"
      @resize="panContainer?.onResize"
      @containerResize="panContainer?.onContainerResize"
    >
      <PinchContainer
        v-tap="() => togglePreview(key)"
        v-for="(item, key) of imageDataList"
        :key="key"
        composable
        :style="{
          width: $q.screen.width + 'px',
          height: $q.screen.height + 'px',
        }"
        :pinchStyle="
          panContainer?.index == key
            ? pinchContainer?.pinchStyle
            : defaultPinchStyle
        "
        @pinch="pinchDispatchHandler"
        @resize="pinchContainer?.onResize"
        @containerResize="
          (size) => {
            resizeDispatchHandler(size, key);
          }
        "
      >
        <img
          class="full fit-cover"
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
import { ref, onMounted, watch } from "vue";
import { useQuasar, morph } from "quasar";
import { Camera, CameraResultType } from "@capacitor/camera";
import PanContainer from "@/components/PanContainer.vue";
import PinchContainer from "@/components/PinchContainer.vue";
import { usePanContainer } from "@/components/usePanContainer";
import { usePinchContainer } from "@/components/usePinchContainer";

const $q = useQuasar();
const panContainer = ref(
  usePanContainer({
    index: 0,
    vertical: false,
    distanceThreshold: 0.6,
    velocityThreshold: 0.3,
  })
);
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
const imageDataList = ref([]);
const cameraOptions = ref({
  quality: 90,
  direction: "REAR",
  resultType: CameraResultType.Uri,
});
const panOption = ref(false);
const pinching = ref(false);
const thumbRef = ref({});
const fullRef = ref({});
const dimmed = ref(false);
const showPreview = ref(false);
const morphing = ref(false);
const cancelMorph = ref();

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

function togglePreview(key) {
  const temp = showPreview.value;
  if (!temp && dimmed.value && cancelMorph.value) {
    cancelMorph.value();
    cancelMorph.value = null;
    dimmed.value = false;
    return;
  }
  if (morphing.value) return;

  cancelMorph.value = morph({
    from: showPreview.value ? fullRef.value[key] : thumbRef.value[key],
    to: showPreview.value ? thumbRef.value[key] : fullRef.value[key],
    hideFromClone: true,
    keepToClone: true,
    resize: true,
    onToggle: () => {
      if (temp) showPreview.value = false; // exit preview
      morphing.value = true;
      dimmed.value = !temp;
      resetPinchContainer();
      panContainer.value?.setIndex(key);
    },
    onEnd: (direction) => {
      if (!temp && dimmed.value && direction == "to") showPreview.value = true; // enter preview
      cancelMorph.value = null;
      morphing.value = false;
    },
  });
}

function resetPinchContainer() {
  pinchContainer.value?.setScaleRatio(1);
  pinchContainer.value?.setOffsetX(0);
  pinchContainer.value?.setOffsetY(0);
  pinchContainer.value?.onContainerResize(
    pinchContainerSizeList.value[panContainer.value?.index]
  );
}

onMounted(() => {
  for (let i = 0; i < 2; i++) {
    imageDataList.value.push({
      webPath: "https://cdn.quasar.dev/img/parallax1.jpg",
    });
    imageDataList.value.push({
      webPath: "https://cdn.quasar.dev/img/parallax2.jpg",
    });
  }
});
</script>
