<template>
  <q-tabs
    v-model="index"
    narrow-indicator
    dense
    indicator-color="primary"
    active-color="primary"
    class="full dark-mode"
    @update:model-value="
      (val) => {
        setIndex(val);
        setDuration(300);
      }
    "
  >
    <q-tab
      v-for="(item, key) of tabList"
      :key="key"
      :name="key"
      :label="item.label"
    />
  </q-tabs>
  <PanContainer
    class="full"
    composable
    :panStyle="panStyle"
    @pan="panDispatchHandler"
    @resize="onResize"
    @containerResize="onContainerResize"
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
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import PanContainer from "@/components/PanContainer.vue";
import { usePanContainer } from "@/components/usePanContainer";

const $q = useQuasar();
const {
  panStyle,
  index,
  handlePan,
  onResize,
  onContainerResize,
  setIndex,
  setDuration,
} = usePanContainer({
  index: 0,
  vertical: false,
  distanceThreshold: 0.6,
  velocityThreshold: 0.3,
});
const offset = ref();
const panOption = ref(""); // pan or scroll

const tabList = ref([
  { label: "Label 0" },
  { label: "Label 1" },
  { label: "Label 2" },
  { label: "Label 3" },
  { label: "Label 4" },
  { label: "Label 5" },
  { label: "Label 6" },
  { label: "Label 7" },
  { label: "Label 8" },
  { label: "Label 9" },
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
    handlePan(e);
  }

  if (e.type == "panend") {
    panOption.value = "";
  }
}
</script>
