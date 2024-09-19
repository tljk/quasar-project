<template>
  <q-page class="fixed-full dark-mode scroll hide-scrollbar">
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
        :style="{
          width: $q.screen.width + 'px',
          height: $q.screen.height + 'px',
        }"
        vertical
      >
        <q-page
          v-for="key1 of 5"
          :key="key1"
          :style="{
            width: $q.screen.width + 'px',
            height: $q.screen.height + 'px',
          }"
          class="dark-mode flex justify-center items-center"
        >
          <div class="text-h1 text-bold text-center">
            col:{{ key }} row{{ key1 }}
          </div>
        </q-page>
      </PanContainer>
    </PanContainer>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import PanContainer from "@/components/PanContainer.vue";
import { usePanContainer } from "@/components/usePanContainer";

const $q = useQuasar();
const { panStyle, handlePan, onResize, onContainerResize } = usePanContainer({
  index: 2,
  vertical: false,
  distanceThreshold: 0.6,
  velocityThreshold: 0.3,
});
</script>
