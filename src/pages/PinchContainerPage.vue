<template>
  <q-page class="fixed-full dark-mode scroll hide-scrollbar">
    <img
      v-morph:image:container.resize="morphGroupModel"
      src="https://cdn.quasar.dev/img/parallax2.jpg"
      style="width: 50vw; height: 50vw; object-fit: cover"
      @click="togglePinchContainer"
    />

    <PinchContainer
      class="fixed-center"
      v-show="morphGroupModel == 'prev'"
      composable
      :style="{
        width: $q.screen.width + 'px',
        height: $q.screen.height + 'px',
      }"
      :pinchStyle="pinchStyle"
      @pinch="handlePinch"
      @pan="handlePan"
      @resize="onResize"
      @containerResize="onContainerResize"
      @click="togglePinchContainer"
    >
      <img
        v-morph:prev:container.resize="morphGroupModel"
        style="max-width: 100%; max-height: 100%; object-fit: cover"
        loading="lazy"
        src="https://cdn.quasar.dev/img/parallax2.jpg"
      />
    </PinchContainer>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import PinchContainer from "@/components/PinchContainer.vue";
import { usePinchContainer } from "@/components/usePinchContainer";

const $q = useQuasar();
const {
  pinchStyle,
  scaleRatio,
  offsetX,
  offsetY,
  handlePinch,
  handlePan,
  onResize,
  onContainerResize,
} = usePinchContainer({ maxScaleRatio: 10, minScaleRatio: 0.1 });

const morphGroupModel = ref("image");

function togglePinchContainer() {
  if (morphGroupModel.value === "image") {
    morphGroupModel.value = "prev";
  } else {
    scaleRatio.value = 1;
    offsetX.value = 0;
    offsetY.value = 0;
    morphGroupModel.value = "image";
  }
}
</script>
