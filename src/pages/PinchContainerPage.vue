<template>
  <MainLayout title="Pinch" v-model="offset">
    <template #gesture>
      <InteractiveContainer
        ref="zoomContainerRef"
        class="flex"
        :style="style"
        @dragEnd="onDragEnd"
        @pinchEnd="onPinchEnd"
      >
        <img
          v-gesture:drag:pinch
          class="full block"
          loading="lazy"
          src="../assets/parallax2.jpg"
        />
      </InteractiveContainer>
    </template>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import InteractiveContainer from "@/components/InteractiveContainer.vue";
import MainLayout from "@/layouts/MainLayout.vue";

const zoomContainerRef = ref();
const offset = ref();
const $q = useQuasar();

const style = computed(() => ({
  width: $q.screen.width + "px",
  height: $q.screen.height - offset.value + "px",
}));
const transform = computed(() => zoomContainerRef.value?.transform);
const animate = computed(() => zoomContainerRef.value?.animate);

const onDragEnd = () => {
  if (transform.value.scaleX <= 1) {
    animate.value("bounce", 1, 0, 0, 300, "replace");
  }
};

const onPinchEnd = () => {
  if (transform.value.scaleX <= 1) {
    animate.value("bounce", 1, 0, 0, 300, "replace");
  }
};
</script>
