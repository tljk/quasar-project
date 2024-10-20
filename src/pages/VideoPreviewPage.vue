<template>
  <MainLayout title="Video">
    <template #page>
      <q-page-container class="full">
        <q-page
          class="full dark-mode no-scroll"
          :style-fn="
            (offsetValue) => {
              offset = offsetValue;
            }
          "
        >
          <PanContainer
            class="full"
            vertical
            composable
            :panStyle="panContainer?.panStyle"
            @pan="panDispatchHandler"
            @resize="panContainer?.onResize"
            @containerResize="panContainer?.onContainerResize"
          >
            <div :style="padStyle"></div>
            <PinchContainer
              v-for="item in virtualVideoList"
              v-tap="onTap"
              composable
              :key="item.index"
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
              <video
                class="full fit-cover block no-pointer-events"
                preload
                :loop="loop"
                :muted="muted"
                :src="item.webPath"
                :poster="item.poster"
                :ref="
                  (el) => {
                    videoRef[item.index] = el;
                  }
                "
              ></video>
            </PinchContainer>
          </PanContainer>

          <div id="player" class="full fit"></div>

          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-fab color="primary" icon="keyboard_arrow_up" direction="up">
              <q-fab-action
                color="secondary"
                icon="add_a_photo"
                @click.stop="getVideo"
              />
              <q-fab-action
                color="secondary"
                icon="fullscreen"
                @click.stop="onFullScreen"
              />
              <q-fab-action
                color="secondary"
                icon="music_off"
                @click.stop="muted = !muted"
              />
            </q-fab>
          </q-page-sticky>
        </q-page>
      </q-page-container>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useQuasar } from "quasar";
import { useAppStore } from "src/stores/appStore";
import { Capacitor } from "@capacitor/core";
import { CapacitorVideoPlayer } from "capacitor-video-player";
import { CapacitorChooseVideo } from "capacitor-choose-video";
import MainLayout from "@/layouts/MainLayout.vue";
import PanContainer from "@/components/PanContainer.vue";
import { usePanContainer } from "@/components/usePanContainer";
import PinchContainer from "@/components/PinchContainer.vue";
import { usePinchContainer } from "@/components/usePinchContainer";

const $q = useQuasar();
const appStore = useAppStore();
const panContainer = ref(
  usePanContainer({
    index: 0,
    vertical: true,
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
const defaultPinchStyle = ref({
  transform: "scale(1) translate(0px, 0px)",
  transition: "transform 0.3s",
});
const pinchContainerSizeList = ref({});
const panOption = ref(false);
const pinching = ref(false);
const muted = ref(true);
const loop = ref(true);
const fullScreen = ref(false);
const offset = ref(0);
const videoList = ref([]);
const posterList = ref([]);
const virtualVideoList = computed(() => {
  return videoList.value
    .slice(
      Math.max(0, panContainer.value?.index - 1),
      panContainer.value?.index + 2
    )
    .map((url, index) => {
      return {
        webPath: Capacitor.convertFileSrc(url),
        poster: posterList.value[index],
        index: Math.max(0, panContainer.value?.index - 1) + index,
      };
    });
});
const videoRef = ref({});
const playerOptions = ref({
  playerId: "player",
  componentTag: "div",
  mode: "fullscreen",
});
const style = computed(() => ({
  width: $q.screen.width + "px",
  height: $q.screen.height - offset.value + "px",
}));
const padStyle = computed(() => {
  return {
    height: `${
      ($q.screen.height - offset.value) *
      Math.max(0, panContainer.value?.index - 1)
    }px`,
    width: `${$q.screen.width}px`,
  };
});

watch(
  () => panContainer.value.index,
  (index, oldIndex) => {
    if (videoList.value.length == 0) {
      loadVideo();
    }
    if (index == videoList.value.length - 1) {
      loadVideo();
    }
    videoRef.value[oldIndex]?.pause();
    videoRef.value[index]?.play();
  },
  { immediate: true }
);
watch(
  () => panContainer.value?.index,
  () => {
    resetPinchContainer();
  }
);

async function onFullScreen() {
  fullScreen.value = !fullScreen.value;
  if (fullScreen.value) {
    videoRef.value[panContainer.value?.index]?.pause();
    await CapacitorVideoPlayer.initPlayer(
      Object.assign(playerOptions.value, {
        url: videoList.value[panContainer.value?.index],
        poster: posterList.value[panContainer.value?.index],
      })
    ).catch((error) => {
      $q.notify({
        message: `Error initializing player: ${error.message}`,
      });
    });
  }
}

async function getVideo() {
  if (appStore.device.capacitor) {
    await CapacitorChooseVideo.getVideo()
      .then(({ path }) => {
        if (path) {
          videoList.value.push(path);
          posterList.value.push("");
        }
      })
      .catch((error) => {
        $q.notify({
          message: `Error getting video: ${error.message}`,
        });
      });
  } else {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        videoList.value.push(URL.createObjectURL(file));
        posterList.value.push("");
      }
    };
    input.click();
  }
}

function onTap() {
  const video = videoRef.value[panContainer.value?.index];
  if (video) {
    video.paused ? video.play() : video.pause();
  }
}

function loadVideo() {}

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

onMounted(async () => {
  CapacitorVideoPlayer.addListener("jeepCapVideoPlayerExit", () => {
    fullScreen.value = false;
  });
});
</script>
