<template>
  <div class="overflow-hidden" v-pan="handlePan">
    <div
      class="flex no-wrap"
      :class="{ column: props.vertical, row: !props.vertical }"
      :style="style"
      style="width: fit-content; height: fit-content"
    >
      <slot></slot>
      <q-resize-observer @resize="onContainerResize" />
    </div>
    <q-resize-observer @resize="onResize" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { usePanContainer } from "./usePanContainer";

const props = defineProps({
  composable: { type: Boolean, default: false },
  panStyle: { type: Object },
  // following props are used by usePanContainer
  index: { type: Number, default: 0 },
  vertical: { type: Boolean, default: false },
  distanceThreshold: { type: Number, default: 0.6 },
  velocityThreshold: { type: Number, default: 0.3 },
});
const emit = defineEmits(["pan", "pinch", "resize", "containerResize"]);

let style;
let handlePan;
let onResize;
let onContainerResize;

if (props.composable) {
  style = computed(() => props.panStyle);

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
  const panContainer = usePanContainer(props);
  style = panContainer.panStyle;
  handlePan = panContainer.handlePan;
  onResize = panContainer.onResize;
  onContainerResize = panContainer.onContainerResize;
}
</script>

<style lang="scss" scoped>
:slotted(div) {
  flex-shrink: 0;
}
</style>
