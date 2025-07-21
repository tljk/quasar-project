<template>
  <MainLayout title="Camera" v-model="offset">
    <template #dropdown-content>
      <q-list>
        <q-item clickable @click="takePicture">
          <q-item-section> Take Picture </q-item-section>
        </q-item>
      </q-list>
    </template>
    <template #gesture>
      <InteractiveContainer
        ref="panContainerRef"
        :style="style"
        :alignCenter="false"
        :scaleOnPinch="false"
        @dragEnd="onPanDragEnd"
        @pinchEnd="onPanPinchEnd"
        @containerResize="onPanContainerResize"
        @wrapperResize="onPanWrapperResize"
      >
        <div
          v-gesture:drag:pinch
          class="full-content flex no-wrap"
          :class="{ column: vertical, row: !vertical }"
        >
          <div :style="padStyle"></div>
          <InteractiveContainer
            v-for="(item, index) in virtualImageList"
            :key="item.webPath"
            :ref="
              (element) => {
                if (element && index === virtualIndex)
                  zoomContainerRef = element;
              }
            "
            :style="style"
            class="flex"
            @dragEnd="onZoomDragEnd"
            @pinchEnd="onZoomPinchEnd"
            @reachBoundary="onZoomReachBoundary"
          >
            <img
              v-gesture:drag:pinch
              class="full block"
              loading="lazy"
              :src="item.webPath"
            />
          </InteractiveContainer>
        </div>
      </InteractiveContainer>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { Camera, CameraResultType } from "@capacitor/camera";
import InteractiveContainer from "@/components/InteractiveContainer.vue";
import MainLayout from "@/layouts/MainLayout.vue";

const panContainerRef = ref();
const zoomContainerRef = ref();
const offset = ref();
const $q = useQuasar();

const index = ref(0);
const containerLength = ref(0);
const screenLength = ref(0);
const vertical = false;
const distanceThreshold = 0.25;
const velocityThreshold = 0.3;
const baseDuration = 300;
const imageList = ref([]);
const cameraOptions = ref({
  quality: 90,
  direction: "REAR",
  resultType: CameraResultType.Uri,
});

const style = computed(() => ({
  width: $q.screen.width + "px",
  height: $q.screen.height - offset.value + "px",
}));
const padStyle = computed(() => {
  return {
    width: `${$q.screen.width * Math.max(0, index.value - 1)}px`,
    height: `${$q.screen.height}px`,
  };
});
const virtualIndex = computed(() => Math.min(1, index.value));
const virtualImageList = computed(() =>
  imageList.value.slice(Math.max(0, index.value - 1), index.value + 2)
);
const transformPan = computed(() => panContainerRef.value?.transform);
const animatePan = computed(() => panContainerRef.value?.animate);
const screenDistance = computed(() => -index.value * screenLength.value);
const maxIndex = computed(() => containerLength.value / screenLength.value - 1);
const transformZoom = computed(() => zoomContainerRef.value?.transform);
const animateZoom = computed(() => zoomContainerRef.value?.animate);

async function takePicture() {
  await Camera.getPhoto(cameraOptions.value)
    .then((image) => {
      imageList.value.push(image);
    })
    .catch((error) => {
      $q.notify({
        message: `Error taking picture: ${error.message}`,
      });
    });
}

const getAnimationDuration = (state) => {
  const directionalDistance = vertical ? state.distanceY : state.distanceX;
  if (
    state.distance > screenLength.value * distanceThreshold ||
    state.velocity > velocityThreshold
  ) {
    if (directionalDistance > 10) {
      index.value = Math.ceil(
        -transformPan.value.translateX / screenLength.value
      );
    } else if (directionalDistance < -10) {
      index.value = Math.floor(
        -transformPan.value.translateX / screenLength.value
      );
    }
  }
  index.value = Math.min(Math.max(index.value, 0), maxIndex.value);

  const directionalVelocity = vertical ? state.velocityY : state.velocityX;
  const duration =
    baseDuration * (1 - 0.5 * Math.min(Math.abs(directionalVelocity) / 1.5, 1));
  return duration;
};

const onPanDragEnd = (event) => {
  const duration = getAnimationDuration(event.detail.state);
  const [x, y] = vertical
    ? [0, screenDistance.value]
    : [screenDistance.value, 0];
  animatePan.value("bounce", 1, x, y, duration, "replace");
};

const onPanPinchEnd = (event) => {
  const duration = getAnimationDuration(event.detail.state);
  const [x, y] = vertical
    ? [0, screenDistance.value]
    : [screenDistance.value, 0];
  animatePan.value("bounce", 1, x, y, duration, "replace");
};

const onPanContainerResize = (size) => {
  containerLength.value = vertical ? size.height : size.width;
};

const onPanWrapperResize = (size) => {
  screenLength.value = vertical ? size.height : size.width;
  const [x, y] = vertical
    ? [0, screenDistance.value]
    : [screenDistance.value, 0];
  animatePan.value("bounce", 1, x, y, 0, "replace");
};

const onZoomDragEnd = () => {
  if (transformZoom.value.scaleX <= 1) {
    animateZoom.value("bounce", 1, 0, 0, baseDuration, "replace");
  }

  const [x, y] = vertical
    ? [0, screenDistance.value]
    : [screenDistance.value, 0];
  animatePan.value("bounce", 1, x, y, baseDuration, "replace");
};

const onZoomPinchEnd = () => {
  if (transformZoom.value.scaleX <= 1) {
    animateZoom.value("bounce", 1, 0, 0, baseDuration, "replace");
  }

  const [x, y] = vertical
    ? [0, screenDistance.value]
    : [screenDistance.value, 0];
  animatePan.value("bounce", 1, x, y, baseDuration, "replace");
};

const onZoomReachBoundary = (bounded, event) => {
  if (!panContainerRef.value) return;

  if (bounded.get("translateX")) {
    const gestureEvent = new CustomEvent(event.type, {
      detail: event.detail,
      bubbles: true,
      cancelable: true,
    });
    panContainerRef.value.container.dispatchEvent(gestureEvent);
  }
};
</script>
