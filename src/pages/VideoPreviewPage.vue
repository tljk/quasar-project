<template>
  <MainLayout title="Video" v-model="offset">
    <div v-if="fullScreen" class="full" id="player"></div>
    <div v-else>
      <video
        class="full block"
        controls
        controlslist="nofullscreen"
        muted
        :src="webPath"
        :poster="poster"
      ></video>
    </div>
    <q-btn v-if="!fullScreen" flat label="Fullscreen" @click="onFullScreen" />

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add_a_photo" color="primary" @click.stop="getVideo" />
    </q-page-sticky>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { useAppStore } from "src/stores/appStore";
import { Capacitor } from "@capacitor/core";
import { CapacitorVideoPlayer } from "capacitor-video-player";
import { CapacitorChooseVideo } from "capacitor-choose-video";
import MainLayout from "@/layouts/MainLayout.vue";

const $q = useQuasar();
const appStore = useAppStore();

const fullScreen = ref(false);
const offset = ref();
const video = ref(
  "https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
);
const poster = ref(
  "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217"
);
const webPath = computed(() => {
  return Capacitor.convertFileSrc(video.value);
});
const playerOptions = ref({
  playerId: "player",
  componentTag: "div",
  mode: appStore.device.capacitor ? "fullscreen" : "embedded",
});

async function onFullScreen() {
  fullScreen.value = !fullScreen.value;
  if (fullScreen.value) {
    await CapacitorVideoPlayer.initPlayer(
      Object.assign(playerOptions.value, {
        url: video.value,
        poster: poster.value,
        width: $q.screen.width,
        height: $q.screen.height - offset.value,
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
          video.value = path;
          poster.value = "";
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
        video.value = URL.createObjectURL(file);
        poster.value = "";
      }
    };
    input.click();
  }
}

onMounted(async () => {
  CapacitorVideoPlayer.addListener("jeepCapVideoPlayerExit", () => {
    fullScreen.value = false;
  });
});
</script>
