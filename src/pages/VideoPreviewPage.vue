<template>
  <MainLayout title="Video" v-model="offset">
    <template #dropdown-content>
      <q-list>
        <q-item clickable @click="getVideo">
          <q-item-section> Add Videos </q-item-section>
        </q-item>
        <q-item clickable @click="onFullScreen">
          <q-item-section> Full Screen </q-item-section>
        </q-item>
        <q-item clickable @click="muted = !muted">
          <q-item-section> {{ muted ? "Unmute" : "Mute" }} </q-item-section>
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
            v-for="(item, index) in virtualVideoList"
            :key="item.webPath"
            :ref="
              (element) => {
                if (element && index === virtualIndex)
                  zoomContainerRef = element;
              }
            "
            :style="style"
            class="flex"
            @tapEnd="onZoomTapEnd"
            @dragEnd="onZoomDragEnd"
            @pinchEnd="onZoomPinchEnd"
            @reachBoundary="onZoomReachBoundary"
          >
            <video
              v-gesture:tap:drag:pinch
              class="full block"
              preload
              :loop="loop"
              :muted="muted"
              :src="item.webPath"
              :poster="item.poster"
              :ref="
                (element) => {
                  if (element && index === virtualIndex) {
                    if (videoRef && !videoRef.paused) videoRef.pause();
                    videoRef = element;
                    if (videoRef && autoplay) videoRef.play();
                  }
                }
              "
            />
          </InteractiveContainer>
        </div>
      </InteractiveContainer>

      <input
        type="file"
        id="videoInput"
        multiple
        accept="video/*"
        style="display: none"
        @change="onChange"
      />
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onActivated, onDeactivated } from "vue";
import { useQuasar } from "quasar";
import { Capacitor } from "@capacitor/core";
import MainLayout from "@/layouts/MainLayout.vue";
import InteractiveContainer from "@/components/InteractiveContainer.vue";

const panContainerRef = ref();
const zoomContainerRef = ref();
const videoRef = ref();
const offset = ref();
const $q = useQuasar();

const index = ref(0);
const containerLength = ref(0);
const screenLength = ref(0);
const vertical = true;
const distanceThreshold = 0.25;
const velocityThreshold = 0.3;
const baseDuration = 300;
const autoplay = ref(true);
const muted = ref(true);
const loop = ref(true);
const videoList = ref([]);
const posterList = ref([]);

const style = computed(() => ({
  width: $q.screen.width + "px",
  height: $q.screen.height - offset.value + "px",
}));
const padStyle = computed(() => {
  return {
    height: `${
      ($q.screen.height - offset.value) * Math.max(0, index.value - 1)
    }px`,
    width: `${$q.screen.width}px`,
  };
});
const virtualIndex = computed(() => Math.min(1, index.value));
const virtualVideoList = computed(() =>
  videoList.value
    .slice(Math.max(0, index.value - 1), index.value + 2)
    .map((url, index) => {
      return {
        webPath: Capacitor.convertFileSrc(url),
        poster: posterList.value[index],
      };
    })
);
const transformPan = computed(() => panContainerRef.value?.transform);
const animatePan = computed(() => panContainerRef.value?.animate);
const screenDistance = computed(() => -index.value * screenLength.value);
const maxIndex = computed(() => containerLength.value / screenLength.value - 1);
const transformZoom = computed(() => zoomContainerRef.value?.transform);
const animateZoom = computed(() => zoomContainerRef.value?.animate);

const onChange = async (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    videoList.value.push(URL.createObjectURL(file));
    posterList.value.push("");
  });
};

const getVideo = async () => {
  const input = document.getElementById("videoInput");
  input.click();
};

const onFullScreen = async () => {
  const video = videoRef.value;
  if (video) {
    video.requestFullscreen();
  }
};

const getAnimationDuration = (state) => {
  const directionalDistance = vertical ? state.distanceY : state.distanceX;
  if (
    state.distance > screenLength.value * distanceThreshold ||
    state.velocity > velocityThreshold
  ) {
    if (directionalDistance > 10) {
      index.value = Math.ceil(
        -transformPan.value.translateY / screenLength.value
      );
    } else if (directionalDistance < -10) {
      index.value = Math.floor(
        -transformPan.value.translateY / screenLength.value
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

const onZoomTapEnd = () => {
  const video = videoRef.value;
  if (video) video.paused ? video.play() : video.pause();
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

  if (bounded.get("translateY")) {
    const gestureEvent = new CustomEvent(event.type, {
      detail: event.detail,
      bubbles: true,
      cancelable: true,
    });
    panContainerRef.value.container.dispatchEvent(gestureEvent);
  }
};

onActivated(() => {
  autoplay.value = true;
});

onDeactivated(() => {
  autoplay.value = false;
});
</script>
