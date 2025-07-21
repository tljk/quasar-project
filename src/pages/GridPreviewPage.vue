<template>
  <MainLayout title="Grid" v-model="offset">
    <template #dropdown-content>
      <q-list>
        <q-item clickable @click="pickImages">
          <q-item-section> Add Pictures </q-item-section>
        </q-item>
      </q-list>
    </template>
    <template #default>
      <div class="flex" :style="scrollStyle">
        <img
          v-for="item of virtualThumbList"
          style="width: 50vmin; height: 50vmin; object-fit: cover"
          loading="lazy"
          :key="item.webPath"
          :src="item.webPath"
        />
      </div>
      <q-scroll-observer @scroll="scrollHandler" />
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { Camera } from "@capacitor/camera";
import MainLayout from "@/layouts/MainLayout.vue";

const $q = useQuasar();

const imageDataList = ref([]);
const scrollTop = ref(0);

const thumbWidth = computed(() => {
  return Math.min($q.screen.width, $q.screen.height) / 2;
});
const scrollIndex = computed(() => {
  return Math.floor(scrollTop.value / thumbWidth.value);
});
const scrollSize = computed(() => {
  return Math.ceil($q.screen.height / thumbWidth.value) + 1;
});
const scrollLength = computed(() => {
  return Math.floor($q.screen.width / thumbWidth.value);
});
const scrollStyle = computed(() => {
  return {
    paddingTop: `${scrollIndex.value * thumbWidth.value}px`,
    paddingBottom: `${
      (Math.ceil(imageDataList.value.length / scrollLength.value) -
        scrollIndex.value -
        scrollSize.value) *
      thumbWidth.value
    }px`,
  };
});
const virtualThumbList = computed(() => {
  return imageDataList.value.slice(
    scrollIndex.value * scrollLength.value,
    (scrollIndex.value + scrollSize.value) * scrollLength.value
  );
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

function scrollHandler(scrollValue) {
  scrollTop.value = scrollValue.position.top;
}
</script>
