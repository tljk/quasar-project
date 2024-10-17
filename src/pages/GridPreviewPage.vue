<template>
  <MainLayout title="Grid">
    <div class="flex" :style="scrollStyle">
      <q-img
        v-tap="() => togglePreview(item.index)"
        v-for="item of virtualThumbList"
        style="width: 50vmin; height: 50vmin"
        :key="item.index"
        :src="item.webPath"
        :ref="
          (el) => {
            thumbRef[item.index] = el?.$el;
          }
        "
      />
    </div>
    <q-scroll-observer @scroll="scrollHandler" />

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
      <div :style="padStyle"></div>
      <PinchContainer
        v-tap="() => togglePreview(item.index)"
        v-for="item of virtualImageList"
        :key="item.index"
        composable
        :style="{
          width: $q.screen.width + 'px',
          height: $q.screen.height + 'px',
        }"
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
          :style="panContainer?.index == item.index ? previewStyle : {}"
          :ref="
            (el) => {
              fullRef[item.index] = el;
            }
          "
        />
      </PinchContainer>
    </PanContainer>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add_a_photo" color="primary" @click.stop="pickImages" />
    </q-page-sticky>
  </MainLayout>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useQuasar } from "quasar";
import { Camera } from "@capacitor/camera";
import PanContainer from "@/components/PanContainer.vue";
import PinchContainer from "@/components/PinchContainer.vue";
import { usePanContainer } from "@/components/usePanContainer";
import { usePinchContainer } from "@/components/usePinchContainer";
import { useMorph } from "@/useMorph";
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
const scrollTop = ref(0);

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
const padStyle = computed(() => {
  return {
    width: `${$q.screen.width * Math.max(0, panContainer.value?.index - 1)}px`,
    height: `${$q.screen.height}px`,
  };
});
const thumbWidth = computed(() => {
  return Math.min($q.screen.width, $q.screen.height) / 2;
});
const scrollIndex = computed(() => {
  return Math.floor(scrollTop.value / thumbWidth.value);
});
const scrollSize = computed(() => {
  return Math.ceil($q.screen.height / thumbWidth.value) + 1;
});
const scrollStyle = computed(() => {
  return {
    paddingTop: `${scrollIndex.value * thumbWidth.value}px`,
    paddingBottom: `${
      (imageDataList.value.length / 2 - scrollIndex.value - scrollSize.value) *
      thumbWidth.value
    }px`,
  };
});
const virtualThumbList = computed(() => {
  const length = Math.floor($q.screen.width / thumbWidth.value);
  return imageDataList.value
    .slice(
      scrollIndex.value * length,
      (scrollIndex.value + scrollSize.value) * length
    )
    .map((item, index) => {
      return {
        ...item,
        index: Math.max(0, scrollIndex.value * length) + index,
      };
    });
});
const virtualImageList = computed(() => {
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

function scrollHandler(scrollValue) {
  scrollTop.value = scrollValue.position.top;
}

function togglePreview(key) {
  if (morphing.value) return;
  const temp = showPreview.value;
  panContainer.value?.setIndex(key);
  nextTick(() => {
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
  });
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
