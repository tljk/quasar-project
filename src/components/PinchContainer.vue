<template>
  <div
    class="overflow-hidden no-two-finger-zoom flex no-wrap justify-center align-center"
    v-pinch="handlePinch"
    v-pan="handlePan"
  >
    <div class="flex no-wrap" :style="style">
      <slot></slot>
      <q-resize-observer @resize="onContainerResize" />
    </div>
    <q-resize-observer @resize="onResize" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { usePinchContainer } from "./usePinchContainer";

const props = defineProps({
  composable: {
    type: Boolean,
    default: false,
  },
  pinchStyle: {
    type: Object,
  },
  // following props are used by usePinchContainer
  maxScaleRatio: {
    type: Number,
    default: 10,
  },
  minScaleRatio: {
    type: Number,
    default: 0.1,
  },
});
const emit = defineEmits(["pinch", "pan", "resize", "containerResize"]);

let style;
let handlePinch;
let handlePan;
let onResize;
let onContainerResize;

if (props.composable) {
  style = computed(() => props.pinchStyle);

  handlePinch = (event) => {
    emit("pinch", event);
  };

  handlePan = (event) => {
    emit("pan", event);
  };

  onResize = (size) => {
    emit("resize", size);
  };

  onContainerResize = (size) => {
    emit("containerResize", size);
  };
} else {
  const pinchContainer = usePinchContainer(props);
  style = pinchContainer.style;
  handlePinch = pinchContainer.handlePinch;
  handlePan = pinchContainer.handlePan;
  onResize = pinchContainer.onResize;
  onContainerResize = pinchContainer.onContainerResize;
}
</script>
