<template>
  <q-page class="fixed-full dark-mode scroll hide-scrollbar">
    <PinchContainer
      class="fixed-center"
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
    >
      <img
        class="full fit-cover block"
        loading="lazy"
        src="https://cdn.quasar.dev/img/parallax2.jpg"
      />
    </PinchContainer>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import PinchContainer from "@/components/PinchContainer.vue";
import { usePinchContainer } from "@/components/usePinchContainer";

const $q = useQuasar();
const { pinchStyle, handlePinch, handlePan, onResize, onContainerResize } =
  usePinchContainer({ maxScaleRatio: 10, minScaleRatio: 0.1 });
</script>
