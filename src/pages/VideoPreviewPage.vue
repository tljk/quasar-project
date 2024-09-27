<template>
  <q-page class="full dark-mode scroll hide-scrollbar">
    <div v-if="fullScreen" id="player" class="full"></div>
    <div v-else @click="onFullScreen">
      <video class="full" autoplay muted :src="video" :poster="poster"></video>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useAppStore } from "src/stores/appStore";
import { CapacitorVideoPlayer } from "capacitor-video-player";

const $q = useQuasar();
const appStore = useAppStore();
const player = ref();

const fullScreen = ref(false);
const video = ref(
  "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
);
const poster = ref(
  "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"
);

async function onFullScreen() {
  fullScreen.value = !fullScreen.value;
  if (fullScreen.value) {
    await player.value
      .initPlayer({
        mode: appStore.device.capacitor ? "fullscreen" : "embedded",
        playerId: "player",
        componentTag: "div",
        title: "Big Buck Bunny",
        url: video.value,
        width: $q.screen.width,
        height: $q.screen.height,
      })
      .catch((err) => {
        $q.notify({
          message: "Error initializing player: " + JSON.stringify(err),
        });
      });
  }
}

onMounted(async () => {
  player.value = CapacitorVideoPlayer;
  player.value.addListener("jeepCapVideoPlayerExit", () => {
    fullScreen.value = false;
  });
});
</script>
