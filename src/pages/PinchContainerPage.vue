<template>
  <MainLayout title="Pinch" v-model="offset">
    <PinchContainer
      composable
      :style="style"
      :pinchStyle="pinchStyle"
      @pinch="handlePinch"
      @pan="handlePan"
      @resize="onResize"
      @containerResize="onContainerResize"
    >
      <img
        class="full fit-cover block no-pointer-events"
        loading="lazy"
        src="https://cdn.quasar.dev/img/parallax2.jpg"
      />
    </PinchContainer>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import PinchContainer from "@/components/PinchContainer.vue";
import { usePinchContainer } from "@/components/usePinchContainer";
import MainLayout from "@/layouts/MainLayout.vue";

const $q = useQuasar();
const { pinchStyle, handlePinch, handlePan, onResize, onContainerResize } =
  usePinchContainer({ maxScaleRatio: 10, minScaleRatio: 0.1 });
const offset = ref();
const style = computed(() => ({
  width: $q.screen.width + "px",
  height: $q.screen.height - offset.value + "px",
}));
</script>
