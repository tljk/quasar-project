<template>
  <div
    class="full overflow-hidden flex justify-center align-center no-two-finger-zoom"
    v-pinch="handlePinch"
    v-pan="handlePan"
  >
    <img
      ref="img"
      :src="props.src"
      :style="style"
      :loading="props.loading"
      style="object-fit: contain; max-width: 100%; max-height: 100%"
      @load="onLoad"
    />
    <q-resize-observer @resize="onResize" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  src: String,
  loading: {
    type: String,
    default: "lazy",
  },
  fit: {
    type: String,
    default: "scale-down",
  },
  maxScaleRatio: {
    type: Number,
    default: 10,
  },
  minScaleRatio: {
    type: Number,
    default: 0.1,
  },
});
const img = ref();

const width = ref(0);
const height = ref(0);
const imgWidth = ref(0);
const imgHeight = ref(0);
const scale = ref(1);
const scaleRatio = ref(1);
const distanceX = ref(0);
const offsetX = ref(0);
const distanceY = ref(0);
const offsetY = ref(0);
const delay = ref(0);

const style = computed(() => {
  return {
    transform: `scale(${scaleRatio.value}) translate(${offsetX.value}px, ${offsetY.value}px)`,
    transition: `transform ${delay.value}s`,
  };
});
const maxDistanceX = computed(() =>
  Math.abs(
    (imgWidth.value * scaleRatio.value - width.value) / 2 / scaleRatio.value
  )
);
const maxDistanceY = computed(() =>
  Math.abs(
    (imgHeight.value * scaleRatio.value - height.value) / 2 / scaleRatio.value
  )
);

function handlePinch(event) {
  if (event.type == "pinchstart") {
    delay.value = 0;
  }

  const temp = scale.value * event.detail.global.scale;
  if (temp >= props.maxScaleRatio) {
    scaleRatio.value = props.maxScaleRatio;
  } else if (temp <= props.minScaleRatio) {
    scaleRatio.value = props.minScaleRatio;
  } else {
    scaleRatio.value = temp;
  }

  offsetX.value =
    distanceX.value + event.detail.global.deltaX / scaleRatio.value;
  offsetY.value =
    distanceY.value + event.detail.global.deltaY / scaleRatio.value;

  if (event.type == "pinchend") {
    delay.value = 0.3;
    if (scaleRatio.value <= 1) {
      scale.value = scaleRatio.value = 1;
      distanceX.value = offsetX.value = 0;
      distanceY.value = offsetY.value = 0;
    } else {
      scale.value = scaleRatio.value;
      if (offsetX.value > maxDistanceX.value) {
        distanceX.value = offsetX.value = maxDistanceX.value;
      } else if (offsetX.value < -maxDistanceX.value) {
        distanceX.value = offsetX.value = -maxDistanceX.value;
      } else {
        distanceX.value = offsetX.value;
      }
      if (offsetY.value > maxDistanceY.value) {
        distanceY.value = offsetY.value = maxDistanceY.value;
      } else if (offsetY.value < -maxDistanceY.value) {
        distanceY.value = offsetY.value = -maxDistanceY.value;
      } else {
        distanceY.value = offsetY.value;
      }
    }
  }
}

function handlePan(event) {
  if (scale.value <= 1) {
    return;
  } else {
    event.detail.global.srcEvent.pauseX = true;
    event.detail.global.srcEvent.pauseY = true;
  }

  if (event.type == "panstart") {
    delay.value = 0;
  }

  const tempX = distanceX.value + event.detail.global.deltaX / scale.value;
  const tempY = distanceY.value + event.detail.global.deltaY / scale.value;
  if (tempX > maxDistanceX.value) {
    offsetX.value = maxDistanceX.value;
    event.detail.global.srcEvent.pauseX = false;
  } else if (tempX < -maxDistanceX.value) {
    offsetX.value = -maxDistanceX.value;
    event.detail.global.srcEvent.pauseX = false;
  } else {
    offsetX.value = tempX;
  }
  if (tempY > maxDistanceY.value) {
    offsetY.value = maxDistanceY.value;
    event.detail.global.srcEvent.pauseY = false;
  } else if (tempY < -maxDistanceY.value) {
    offsetY.value = -maxDistanceY.value;
    event.detail.global.srcEvent.pauseY = false;
  } else {
    offsetY.value = tempY;
  }

  if (event.type == "panend") {
    delay.value = 0.3;
    if (scale.value <= 1) {
      distanceX.value = offsetX.value = 0;
      distanceY.value = offsetY.value = 0;
    } else {
      distanceX.value = offsetX.value;
      distanceY.value = offsetY.value;
    }
  }
}

function onResize(size) {
  width.value = size.width;
  height.value = size.height;
  imgWidth.value = img.value.clientWidth;
  imgHeight.value = img.value.clientHeight;
}

function onLoad() {
  imgWidth.value = img.value.clientWidth;
  imgHeight.value = img.value.clientHeight;
}
</script>
