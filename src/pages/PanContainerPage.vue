<template>
  <MainLayout title="Pan" v-model="offset">
    <template #gesture>
      <InteractiveContainer
        ref="panContainerRef"
        :style="style"
        :alignCenter="false"
        :scaleOnPinch="false"
        @dragEnd="onDragEnd"
        @pinchEnd="onPinchEnd"
        @containerResize="onContainerResize"
        @wrapperResize="onWrapperResize"
      >
        <div
          v-gesture:drag:pinch
          class="full-content flex no-wrap"
          :class="{ column: vertical, row: !vertical }"
        >
          <q-page
            v-for="key of 5"
            :key="key"
            :style="style"
            class="dark-mode flex justify-center items-center"
          >
            <div class="text-h1 text-bold text-center">col:{{ key }}</div>
          </q-page>
        </div>
      </InteractiveContainer>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import InteractiveContainer from "@/components/InteractiveContainer.vue";
import MainLayout from "@/layouts/MainLayout.vue";

const panContainerRef = ref();
const offset = ref();
const $q = useQuasar();

const index = ref(0);
const containerLength = ref(0);
const screenLength = ref(0);
const vertical = false;
const distanceThreshold = 0.25;
const velocityThreshold = 0.3;
const baseDuration = 300;

const style = computed(() => ({
  width: $q.screen.width + "px",
  height: $q.screen.height - offset.value + "px",
}));
const transform = computed(() => panContainerRef.value?.transform);
const animate = computed(() => panContainerRef.value?.animate);
const screenDistance = computed(() => -index.value * screenLength.value);
const maxIndex = computed(() => containerLength.value / screenLength.value - 1);

const getAnimationDuration = (state) => {
  const directionalDistance = vertical ? state.distanceY : state.distanceX;
  if (
    state.distance > screenLength.value * distanceThreshold ||
    state.velocity > velocityThreshold
  ) {
    if (directionalDistance > 10) {
      index.value = Math.ceil(-transform.value.translateX / screenLength.value);
    } else if (directionalDistance < -10) {
      index.value = Math.floor(
        -transform.value.translateX / screenLength.value
      );
    }
  }
  index.value = Math.min(Math.max(index.value, 0), maxIndex.value);

  const directionalVelocity = vertical ? state.velocityY : state.velocityX;
  const duration =
    baseDuration * (1 - 0.5 * Math.min(Math.abs(directionalVelocity) / 1.5, 1));
  return duration;
};

const onDragEnd = (event) => {
  const duration = getAnimationDuration(event.detail.state);
  const [x, y] = vertical
    ? [0, screenDistance.value]
    : [screenDistance.value, 0];
  animate.value("bounce", 1, x, y, duration, "replace");
};

const onPinchEnd = (event) => {
  const duration = getAnimationDuration(event.detail.state);
  const [x, y] = vertical
    ? [0, screenDistance.value]
    : [screenDistance.value, 0];
  animate.value("bounce", 1, x, y, duration, "replace");
};

const onContainerResize = (size) => {
  containerLength.value = vertical ? size.height : size.width;
};

const onWrapperResize = (size) => {
  screenLength.value = vertical ? size.height : size.width;
};
</script>
