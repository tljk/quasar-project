<template>
  <div>
    <PanContainer
      class="full"
      composable
      :panStyle="panContainer.panStyle"
      @pan="panDispatchHandler"
      @resize="panContainer.onResize"
      @containerResize="panContainer.onContainerResize"
    >
      <q-page
        v-for="(item, key) of tabList"
        :key="key"
        :style="style"
        :style-fn="styleFn"
        class="dark-mode scroll hide-scrollbar"
        style="touch-action: pan-y"
      >
        <p v-for="n in 50" :key="n">{{ item.label }} - {{ n }}</p>
      </q-page>
    </PanContainer>
    <q-page-sticky position="top" expand>
      <PanTabBar
        v-model="panContainer.index"
        ref="panTabBar"
        :tabList="tabList"
        padRight="36px"
        @click="
          (index) => {
            panContainer.setIndex(index);
            panContainer.setDuration(300);
          }
        "
      >
      </PanTabBar>
      <q-btn
        flat
        dense
        class="fixed-right dark-mode"
        icon="menu"
        @click="() => tabList.push({ label: 'Label' })"
      ></q-btn>
    </q-page-sticky>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import PanContainer from "@/components/PanContainer.vue";
import { usePanContainer } from "@/components/usePanContainer";
import PanTabBar from "@/components/PanTabBar.vue";

const $q = useQuasar();
const panContainer = ref(
  usePanContainer({
    index: 0,
    vertical: false,
    distanceThreshold: 0.6,
    velocityThreshold: 0.3,
  })
);
const panTabBar = ref();
const offset = ref();
const panOption = ref(""); // pan or scroll

const tabList = ref([
  { label: "Label" },
  { label: "Label" },
  { label: "Label" },
]);

const style = computed(() => ({
  width: $q.screen.width + "px",
  height: $q.screen.height - offset.value + "px",
}));

function styleFn(offsetValue) {
  offset.value = offsetValue;
}

function panDispatchHandler(e) {
  if (e.type == "panstart") {
    if (e.detail.live.direction == "down" || e.detail.live.direction == "up") {
      panOption.value = "scroll";
    } else {
      panOption.value = "pan";
    }
  }

  if (panOption.value == "pan") {
    panContainer.value.handlePan(e);
    panTabBar.value.handlePan(e);
  }

  if (e.type == "panend") {
    panOption.value = "";
  }
}
</script>
