<template>
  <div ref="scrollContainer" class="full dark-mode scroll hide-scrollbar">
    <div class="flex row no-wrap" style="width: max-content; min-width: 100vw">
      <q-btn
        v-for="(item, key) in props.tabList"
        flat
        dense
        class="col-grow"
        :key="key"
        :label="item.label"
        :class="{
          'text-primary': key == props.index,
        }"
        :ref="
          (el) => {
            labelListRef[key] = el;
          }
        "
        @click="onClick(key)"
      >
      </q-btn>
      <slot></slot>
    </div>
    <div class="indicator bg-primary" :style="style"></div>
    <q-resize-observer
      @resize="
        (size) => {
          onResize(size);
          onChange();
        }
      "
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onActivated } from "vue";
import { scroll, dom } from "quasar";

const props = defineProps({
  index: {
    type: Number,
    default: 0,
  },
  tabList: {
    type: Array,
    default: () => [],
  },
  scrollLeft: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 0,
  },
  indicatorStyle: {
    type: Object,
  },
});
const emit = defineEmits(["click", "change", "resize"]);
const scrollContainer = ref();
const labelListRef = ref({});
const style = computed(() => props.indicatorStyle);

watch(
  () => Object.keys(labelListRef.value).length,
  () => {
    onChange();
  },
  { immediate: true }
);

watch(
  () => props.scrollLeft,
  () => {
    scroll.setHorizontalScrollPosition(
      scrollContainer.value,
      props.scrollLeft,
      props.duration
    );
  }
);

function onClick(index) {
  emit("click", index);
}

function onChange() {
  const labelWidth = {};
  Object.keys(labelListRef.value).forEach((key) => {
    labelWidth[key] = dom.width(labelListRef.value[key].$el);
  });
  emit("change", labelWidth);
}

function onResize(size) {
  emit("resize", size);
}

onActivated(() => {
  scroll.setHorizontalScrollPosition(scrollContainer.value, props.scrollLeft);
});
</script>
