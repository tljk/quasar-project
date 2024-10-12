<template>
  <div ref="scrollContainer" class="full dark-mode scroll hide-scrollbar">
    <div class="flex row no-wrap" style="width: max-content; min-width: 100vw">
      <slot></slot>
    </div>
    <div class="indicator"></div>
    <q-resize-observer @resize="onResize" />
  </div>
</template>

<script setup>
import { ref, watch, onActivated } from "vue";
import { scroll } from "quasar";

const props = defineProps({
  offset: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 300,
  },
});
const emit = defineEmits(["resize"]);
const scrollContainer = ref();

watch(
  () => props.offset,
  () => {
    scroll.setHorizontalScrollPosition(
      scrollContainer.value,
      props.offset,
      props.duration
    );
  }
);

function onResize(size) {
  emit("resize", size);
}

onActivated(() => {
  scroll.setHorizontalScrollPosition(
    scrollContainer.value,
    props.offset,
    props.duration
  );
});
</script>
