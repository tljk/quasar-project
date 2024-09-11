<template>
  <q-page
    class="fixed-full dark-mode scroll hide-scrollbar flex justify-start content-start"
  >
    <div
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
        @click="togglePreview(key)"
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
      :panStyle="panStyle"
      :style="{ opacity: showPreview ? 1 : 0 }"
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
const thumbRef = ref({});
const fullRef = ref({});
const dimmed = ref(false);
const showPreview = ref(false);
const cancelMorph = ref();

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
  const temp = showPreview.value;
  if (!temp && dimmed.value && cancelMorph.value) {
    cancelMorph.value();
    cancelMorph.value = null;
    dimmed.value = false;
    return;
  }
  cancelMorph.value = morph({
    from: showPreview.value ? fullRef.value[key] : thumbRef.value[key],
    to: showPreview.value ? thumbRef.value[key] : fullRef.value[key],
    hideFromClone: true,
    keepToClone: true,
    resize: true,
    onToggle: () => {
      if (temp) showPreview.value = false; // exit preview
      dimmed.value = !temp;
      setIndex(key);
      pinchContainerList.value[key]?.setScaleRatio(1);
      pinchContainerList.value[key]?.setOffsetX(0);
      pinchContainerList.value[key]?.setOffsetY(0);
    },
    onEnd: (direction) => {
      if (!temp && direction == "to") showPreview.value = true; // enter preview
    },
  });
}

onMounted(() => {
  for (let i = 0; i < 2; i++) {
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
  }
});
</script>
