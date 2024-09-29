<template>
  <MainLayout title="Pan" v-model="offset">
    <PanContainer
      class="full"
      composable
      :panStyle="panStyle"
      @pan="handlePan"
      @resize="onResize"
      @containerResize="onContainerResize"
    >
      <PanContainer
        v-for="key of 5"
        :key="key"
        :index="2"
        :style="style"
        vertical
      >
        <q-page
          v-for="key1 of 5"
          :key="key1"
          :style="style"
          class="dark-mode flex justify-center items-center"
        >
          <div class="text-h1 text-bold text-center">
            col:{{ key }} row{{ key1 }}
          </div>
        </q-page>
      </PanContainer>
    </PanContainer>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import PanContainer from "@/components/PanContainer.vue";
import { usePanContainer } from "@/components/usePanContainer";
import MainLayout from "@/layouts/MainLayout.vue";

const $q = useQuasar();
const { panStyle, handlePan, onResize, onContainerResize } = usePanContainer({
  index: 2,
  vertical: false,
  distanceThreshold: 0.6,
  velocityThreshold: 0.3,
});
const offset = ref();
const style = computed(() => ({
  width: $q.screen.width + "px",
  height: $q.screen.height - offset.value + "px",
}));
</script>
