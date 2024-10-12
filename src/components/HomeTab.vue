<template>
  <div>
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
    <q-page-sticky position="top" expand>
      <PanTabBar
        :offset="panTabBar.offset.value"
        :duration="panTabBar.duration.value"
        @resize="panTabBar.onResize"
      >
        <q-btn
          v-for="(item, key) in tabList"
          flat
          dense
          class="col-grow"
          :key="key"
          :label="item.label"
          :class="{
            'text-primary': key == index,
          }"
          :ref="
            (el) => {
              labelWidthRef[key] = el?.$el.clientWidth;
            }
          "
          @click="
            () => {
              panTabBar.onChange(key);
              setIndex(key);
              setDuration(300);
            }
          "
        >
        </q-btn>
        <q-btn
          flat
          dense
          icon="menu"
          @click="
            () => {
              tabList.push({ label: `Label ${Math.pow(10, index)}` });
            }
          "
        />
      </PanTabBar>
    </q-page-sticky>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import PanContainer from "@/components/PanContainer.vue";
import { usePanContainer } from "@/components/usePanContainer";
import PanTabBar from "@/components/PanTabBar.vue";
import { usePanTabBar } from "./usePanTabBar";

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
const labelWidthRef = ref({});
const panTabBar = usePanTabBar(index, labelWidthRef);
const offset = ref();
const panOption = ref(""); // pan or scroll

const tabList = ref([{ label: "Label" }]);

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
    panTabBar.handlePan(e);
  }

  if (e.type == "panend") {
    panOption.value = "";
  }
}
</script>
