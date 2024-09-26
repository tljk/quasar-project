<template>
  <q-page
    class="fixed-full dark-mode scroll hide-scrollbar flex justify-start content-start"
  >
    <div
      v-tap="() => togglePreview(key)"
      v-for="(item, key) of imageDataList"
      :key="key"
      style="width: 50vmin; height: 50vmin"
    >
      <q-img
        class="full"
        :src="item.webPath"
        :ref="
          (el) => {
            thumbRef[key] = el.$el;
          }
        "
      />
    </div>

    <div
      class="fullscreen no-pointer-events bg-black"
      :style="dimmedStyle"
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
          class="full fit-cover block no-pointer-events"
          loading="lazy"
          :src="item.webPath"
          :style="panContainer?.index == key ? previewStyle : {}"
          :ref="
            (el) => {
              fullRef[key] = el;
            }
          "
        />
      </PinchContainer>
    </PanContainer>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add_a_photo" color="primary" @click="pickImages" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { Camera } from "@capacitor/camera";
import PanContainer from "@/components/PanContainer.vue";
import PinchContainer from "@/components/PinchContainer.vue";
import { usePanContainer } from "@/components/usePanContainer";
import { usePinchContainer } from "@/components/usePinchContainer";
import { useMorph } from "@/useMorph";

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
const thumbRef = ref({});
const fullRef = ref({});
const panOption = ref(""); // pan, pinch or preview
const pinching = ref(false);
const showPreview = ref(false);
const morphing = ref(false);
const scaleRatio = ref(1);
const offsetX = ref(0);
const offsetY = ref(0);
const duration = ref(0);
const dimmed = ref(0);

const previewStyle = computed(() => {
  return {
    transform: `scale(${scaleRatio.value}) translate(${offsetX.value}px, ${offsetY.value}px)`,
    transition: `transform ${duration.value}ms`,
  };
});
const dimmedStyle = computed(() => {
  return {
    opacity: dimmed.value,
    transition: `opacity ${duration.value}ms`,
  };
});

async function pickImages() {
  await Camera.pickImages()
    .then(({ photos }) => {
      imageDataList.value.push(...photos);
    })
    .catch((error) => {
      $q.notify({
        message: `Error picking images: ${error.message}`,
      });
    });
}

function panDispatchHandler(event) {
  if (pinching.value) return;
  const borderReached = pinchContainer.value?.borderReached;
  if (borderReached && event.type == "panstart") {
    if (
      ((borderReached.top && event.detail.live.direction == "down") ||
        (borderReached.bottom && event.detail.live.direction == "up")) &&
      pinchContainer.value?.scaleRatio == 1
    ) {
      panOption.value = "preview";
    } else if (
      (borderReached.left && event.detail.live.direction == "right") ||
      (borderReached.right && event.detail.live.direction == "left")
    ) {
      panOption.value = "pan";
    } else {
      panOption.value = "pinch";
    }
  }

  if (panOption.value == "pan") {
    panContainer.value?.handlePan(event);
  } else if (panOption.value == "pinch") {
    pinchContainer.value?.handlePan(event);
  } else if (panOption.value == "preview") {
    handlePreviewPan(event);
  }

  if (event.type == "panend") {
    panOption.value = "";
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
  if (morphing.value) return;
  const temp = showPreview.value;
  const { morph } = useMorph({
    from: thumbRef.value[key],
    to: fullRef.value[key],
    reverse: temp,
    duration: 300,
    onToggle: () => {
      if (temp) {
        showPreview.value = false;
      } else {
        panContainer.value?.setIndex(key);
      }
      morphing.value = true;
      dimmed.value = temp ? 0 : 1;
      resetPinchContainer();
      setDuration(300);
    },
    onEnd: () => {
      if (!temp) showPreview.value = true;
      morphing.value = false;
    },
  });
  morph();
}

function resetPinchContainer() {
  pinchContainer.value?.setScaleRatio(1);
  pinchContainer.value?.setOffsetX(0);
  pinchContainer.value?.setOffsetY(0);
  pinchContainer.value?.onContainerResize(
    pinchContainerSizeList.value[panContainer.value?.index]
  );
  scaleRatio.value = 1;
  offsetX.value = 0;
  offsetY.value = 0;
}

function handlePreviewPan(e) {
  setDuration(0);
  scaleRatio.value =
    1 - e.detail.global.distance / Math.max($q.screen.width, $q.screen.height);
  dimmed.value = scaleRatio.value;
  offsetX.value = e.detail.global.deltaX / scaleRatio.value;
  offsetY.value = e.detail.global.deltaY / scaleRatio.value;

  if (e.type == "panend") {
    if (scaleRatio.value < 0.8) {
      togglePreview(panContainer.value?.index);
    } else {
      dimmed.value = 1;
      resetPinchContainer();
      setDuration(300);
    }
  }
}

function setDuration(durationValue) {
  duration.value = durationValue;
  if (durationValue <= 0) return;
  setTimeout(() => {
    duration.value = 0;
  }, durationValue);
}
</script>
