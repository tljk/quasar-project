<template>
  <div ref="wrapper" class="overflow-hidden no-touch-events">
    <div
      ref="container"
      class="full-content"
      :class="{ 'margin-auto': props.alignCenter }"
      @gesture:tap="handleTap"
      @gesture:drag="handleDrag"
      @gesture:pinch="handlePinch"
    >
      <slot></slot>
      <q-resize-observer @resize="onContainerResize" />
    </div>
    <q-resize-observer @resize="onWrapperResize" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAnimations } from "@/composables/useAnimations";

const props = defineProps({
  alignCenter: { type: Boolean, default: true },
  scaleOnPinch: { type: Boolean, default: true },
  maxScaleRatio: { type: Number, default: 5 },
  minScaleRatio: { type: Number, default: 0.5 },
});
const emits = defineEmits([
  "tapEnd",
  "dragStart",
  "dragEnd",
  "pinchStart",
  "pinchEnd",
  "reachBoundary",
  "containerResize",
  "wrapperResize",
]);

const wrapper = ref();
const container = ref();
const { playAnimation, stopAnimation, applyAnimation, commitStyle, transform } =
  useAnimations(container);

const relativeTop = ref(0);
const relativeLeft = ref(0);
const wrapperWidth = ref(0);
const wrapperHeight = ref(0);
const containerWidth = ref(0);
const containerHeight = ref(0);
const minTranslateX = computed(
  () =>
    (containerWidth.value * (transform.value.scaleX - 1)) / 2 -
    relativeLeft.value
);
const maxTranslateX = computed(
  () =>
    wrapperWidth.value -
    (containerWidth.value * (transform.value.scaleX + 1)) / 2 -
    relativeLeft.value
);
const minTranslateY = computed(
  () =>
    (containerHeight.value * (transform.value.scaleX - 1)) / 2 -
    relativeTop.value
);
const maxTranslateY = computed(
  () =>
    wrapperHeight.value -
    (containerHeight.value * (transform.value.scaleX + 1)) / 2 -
    relativeTop.value
);

const interupt = (name) => {
  commitStyle(name);
  stopAnimation(name);
};

const animate = (name, scale, x, y, duration, composite, callback) => {
  applyAnimation(
    name,
    {
      transform: `scale(${scale}) translateX(${x}px) translateY(${y}px)`,
    },
    {
      duration: duration,
      easing: "cubic-bezier(0.2, 0.0, 0.0, 1.0)",
      fill: "forwards",
    },
    composite,
    [
      {
        name: "scaleX",
        min: props.minScaleRatio,
        max: props.maxScaleRatio,
      },
      {
        name: "translateX",
        min: () => minTranslateX.value,
        max: () => maxTranslateX.value,
      },
      {
        name: "translateY",
        min: () => minTranslateY.value,
        max: () => maxTranslateY.value,
      },
    ],
    callback
  ).then(() => {
    playAnimation(name)
      .then(() => {
        interupt(name);
      })
      .catch(() => {});
  });
};

const handleTap = (event) => {
  const detail = event.detail;
  if (!detail.recognized) return;
  event.stopPropagation();

  emits("tapEnd", event);
};

const handleDrag = (event) => {
  const detail = event.detail;
  if (detail.phase !== "end") interupt("bounce");
  if (!detail.recognized) return;
  event.stopPropagation();

  if (detail.phase === "move") {
    emits("dragStart", event);

    const point = detail.state.point;
    animate("drag", 1, point.deltaX, point.deltaY, 0, "accumulate", (bounded) =>
      emits("reachBoundary", bounded, event)
    );
  } else if (detail.phase === "end") {
    animate("drag", 1, 0, 0, 0, "accumulate", (bounded) =>
      emits("reachBoundary", bounded, event)
    );
    emits("dragEnd", event);
  }
};

const handlePinch = (event) => {
  const detail = event.detail;
  if (detail.phase !== "end") interupt("bounce");
  if (!detail.recognized) return;
  event.stopPropagation();

  if (detail.phase === "move") {
    emits("pinchStart", event);

    const state = detail.state;
    const point1 = state.point1;
    const point2 = state.point2;
    let scale = 1;
    let deltaX = (point1.deltaX + point2.deltaX) / 2;
    let deltaY = (point1.deltaY + point2.deltaY) / 2;

    if (props.scaleOnPinch) {
      scale = state.scale;
      deltaX -=
        (state.scale - 1) *
        (state.currentCenter.x - containerWidth.value / 2 - relativeLeft.value);
      deltaY -=
        (state.scale - 1) *
        (state.currentCenter.y - containerHeight.value / 2 - relativeTop.value);
    }

    animate("pinch", scale, deltaX, deltaY, 0, "accumulate", (bounded) =>
      emits("reachBoundary", bounded, event)
    );
  } else if (detail.phase === "end") {
    animate("pinch", 1, 0, 0, 0, "accumulate", (bounded) =>
      emits("reachBoundary", bounded, event)
    );
    emits("pinchEnd", event);
  }
};

const onContainerResize = (size) => {
  const { width, height } = size;
  if (width === 0 || height === 0) return;
  [containerWidth.value, containerHeight.value] = [width, height];
  if (props.alignCenter)
    [relativeLeft.value, relativeTop.value] = [
      (wrapperWidth.value - containerWidth.value) / 2,
      (wrapperHeight.value - containerHeight.value) / 2,
    ];
  emits("containerResize", size);
};

const onWrapperResize = (size) => {
  const { width, height } = size;
  if (width === 0 || height === 0) return;
  [wrapperWidth.value, wrapperHeight.value] = [width, height];
  if (props.alignCenter)
    [relativeLeft.value, relativeTop.value] = [
      (wrapperWidth.value - containerWidth.value) / 2,
      (wrapperHeight.value - containerHeight.value) / 2,
    ];
  emits("wrapperResize", size);
};

defineExpose({ wrapper, container, transform, animate });
</script>
