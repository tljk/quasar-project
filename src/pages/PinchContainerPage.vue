<template>
  <q-page class="fixed-full dark-mode scroll hide-scrollbar">
    <PinchContainer
      class="full-window"
      composable
      :pinchStyle="style"
      @pinch="handlePinch"
      @pan="handlePan"
      @resize="onResize"
      @containerResize="onContainerResize"
    >
      <img
        class="full"
        style="object-fit: contain"
        loading="lazy"
        src="https://cdn.quasar.dev/img/parallax2.jpg"
      />
    </PinchContainer>
  </q-page>
</template>

<script setup>
import PinchContainer from "@/components/PinchContainer.vue";
import { usePinchContainer } from "@/components/usePinchContainer";

const { style, handlePinch, handlePan, onResize, onContainerResize } =
  usePinchContainer({ maxScaleRatio: 10, minScaleRatio: 0.1 });
</script>
