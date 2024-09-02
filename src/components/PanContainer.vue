<template>
  <div class="overflow-hidden" v-pan="handlePan">
    <div
      ref="swipeContainer"
      class="flex no-wrap"
      :class="{ column: props.vertical, row: !props.vertical }"
      :style="style"
    >
      <slot></slot>
    </div>
    <q-resize-observer @resize="onResize" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  size: { type: Number },
  vertical: { type: Boolean, default: false },
  distanceThreshold: { type: Number, default: 0.6 },
  velocityThreshold: { type: Number, default: 0.3 },
});
const index = defineModel({ default: 0 });
const swipeContainer = ref();

const width = ref(0);
const height = ref(0);
const offset = ref(0);
const delay = ref(0);

const distance = computed(() => -index.value * length.value);
const length = computed(() => (props.vertical ? height.value : width.value));
const fullLength = computed(() => {
  if (props.size) {
    return length.value * props.size;
  } else {
    return length.value * swipeContainer.value?.children.length ?? 1;
  }
});
const style = computed(() => {
  return props.vertical
    ? {
        height: `${fullLength.value}px`,
        width: `${width.value}px`,
        transform: `translate(0, ${offset.value}px)`,
        transition: `transform ${delay.value}s`,
      }
    : {
        height: `${height.value}px`,
        width: `${fullLength.value}px`,
        transform: `translate(${offset.value}px, 0)`,
        transition: `transform ${delay.value}s`,
      };
});

function handlePan(e) {
  delay.value = 0;
  const tempOffset = props.vertical
    ? e.detail.global.deltaY
    : e.detail.global.deltaX;
  const temp = distance.value + tempOffset;
  if (temp >= 0) {
    offset.value = 0;
  } else if (temp <= -fullLength.value + length.value) {
    offset.value = -fullLength.value + length.value;
  } else {
    offset.value = temp;
  }

  if (e.type == "panend") {
    const velocity = props.vertical
      ? e.detail.live.speedY
      : e.detail.live.speedX;
    const time =
      (length.value - Math.abs(tempOffset)) / Math.abs(velocity) / 666;
    delay.value = time > 0.3 ? 0.3 : time;
    if (
      velocity > props.velocityThreshold ||
      tempOffset > length.value * props.distanceThreshold
    ) {
      // swipe left
      index.value = -Math.ceil(offset.value / length.value);
    } else if (
      velocity < -props.velocityThreshold ||
      tempOffset < -length.value * props.distanceThreshold
    ) {
      // swipe right
      index.value = -Math.floor(offset.value / length.value);
    }
    offset.value = distance.value;
  }
}

function onResize(size) {
  width.value = size.width;
  height.value = size.height;
  delay.value = 0;
  offset.value = distance.value;
}
</script>

<style lang="scss" scoped></style>
