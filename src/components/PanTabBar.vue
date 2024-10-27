<template>
  <div ref="scrollContainer" class="full dark-mode scroll hide-scrollbar">
    <div :style="padStyle">
      <div
        class="flex row no-wrap"
        style="width: max-content; min-width: 100vw"
      >
        <q-btn
          v-for="(item, key) in props.tabList"
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
              if (el?.$el) labelWidth[key] = dom.width(el.$el);
            }
          "
          @click="onClick(key)"
        >
        </q-btn>
      </div>
      <div class="indicator bg-primary" :style="indicatorStyle"></div>
      <q-resize-observer
        @resize="
          (size) => {
            onResize(size);
          }
        "
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onActivated, nextTick } from "vue";
import { scroll, dom } from "quasar";

const props = defineProps({
  tabList: {
    type: Array,
    default: () => [],
  },
});
const index = defineModel({ default: 0 });
const emit = defineEmits(["click"]);
const scrollContainer = ref();
const width = ref(0);
const height = ref(0);
const offset = ref(0);
const duration = ref(0);
const labelWidth = ref({});
const padStyle = ref({});

const fullWidth = computed(() => {
  return Object.values(labelWidth.value).reduce((acc, cur) => acc + cur, 0);
});
const distance = computed(() => {
  return Array.from(
    { length: index.value },
    (_, i) => labelWidth.value[i]
  ).reduce((acc, cur) => acc + cur, 0);
});
const indicatorStyle = computed(() => {
  return {
    height: `${2}px`,
    width: `${labelWidth.value[index.value] / 2}px`,
    transform: `translateX(${
      offset.value + labelWidth.value[index.value] / 4
    }px)`,
    transition: `transform linear ${duration.value}ms, width ${duration.value}ms`,
  };
});
const scrollLeft = computed(() => {
  return distance.value - width.value / 2 + labelWidth.value[index.value] / 2;
});

function handlePan(e) {
  const temp =
    distance.value -
    (e.detail.global.deltaX / width.value) * labelWidth.value[index.value];

  if (temp > 0 && temp < fullWidth.value - labelWidth.value[index.value]) {
    offset.value = temp;
    if (
      scrollLeft.value > labelWidth.value[index.value] &&
      scrollLeft.value <
        fullWidth.value - width.value - labelWidth.value[index.value]
    ) {
      padStyle.value = {
        transform: `translateX(${
          (e.detail.global.deltaX / width.value) * labelWidth.value[index.value]
        }px)`,
      };
    }
  }

  if (e.type == "panend") {
    const prevLeft = scrollLeft.value;
    const prevRight = scrollLeft.value + width.value - fullWidth.value;
    setDuration(200);
    nextTick(() => {
      offset.value = distance.value;

      if (Math.floor(fullWidth.value) > width.value) {
        const currentLeft = scrollLeft.value;
        const currentRight = scrollLeft.value + width.value - fullWidth.value;
        if (prevLeft * currentLeft < 0) {
          padStyle.value = {
            transform: `translateX(${
              prevLeft > currentLeft ? prevLeft : -currentLeft
            }px)`,
            transition: `transform linear ${duration.value}ms`,
          };
        } else if (prevRight * currentRight < 0) {
          padStyle.value = {
            transform: `translateX(${
              prevRight > currentRight ? -currentRight : prevRight
            }px)`,
            transition: `transform linear ${duration.value}ms`,
          };
        } else if (currentLeft * currentRight < 0) {
          padStyle.value = {
            transform: `translateX(${prevLeft - currentLeft}px)`,
            transition: `transform linear ${duration.value}ms`,
          };
        }
      }
    });
  }
}

function onClick(index) {
  emit("click", index);
  setIndex(index);
}

function onResize(size) {
  if (size.width == 0 || size.height == 0) return;
  width.value = size.width;
  height.value = size.height;
}

function setIndex(indexValue) {
  if (indexValue) index.value = indexValue;
  nextTick(() => {
    offset.value = distance.value;
    scroll.setHorizontalScrollPosition(scrollContainer.value, scrollLeft.value);
  });
}

function setDuration(durationValue) {
  duration.value = durationValue;
  setTimeout(() => {
    duration.value = 0;
    padStyle.value = {};
    nextTick(() => {
      scroll.setHorizontalScrollPosition(
        scrollContainer.value,
        scrollLeft.value
      );
    });
  }, durationValue);
}

onActivated(() => {
  scroll.setHorizontalScrollPosition(scrollContainer.value, scrollLeft.value);
});

defineExpose({
  handlePan,
});
</script>
