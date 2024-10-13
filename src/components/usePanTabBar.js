import { ref, computed, nextTick } from "vue";

export function usePanTabBar(index) {
  const width = ref(0);
  const height = ref(0);
  const scrollLeft = ref(0);
  const offset = ref(0);
  const duration = ref(0);
  const position = ref(false);
  const labelWidth = ref({});

  const fullWidth = computed(() => {
    return Object.values(labelWidth.value).reduce((acc, cur) => acc + cur, 0);
  });
  const fullLength = computed(() => {
    return Object.values(labelWidth.value).length;
  });
  const left = computed(() => {
    return width.value / 2 - labelWidth.value[index.value] / 2;
  });
  const right = computed(() => {
    return (
      fullWidth.value - width.value / 2 - labelWidth.value[index.value] / 2
    );
  });
  const distance = computed(() => {
    return Object.keys(labelWidth.value).reduce((acc, cur) => {
      return cur < index.value ? acc + labelWidth.value[cur] : acc;
    }, 0);
  });
  const indicatorStyle = computed(() => {
    if (position.value) {
      return {
        height: `${fullLength.value <= 1 ? 0 : 2}px`,
        width: `${labelWidth.value[index.value]}px`,
        position: `absolute`,
        left: `${width.value / 2 - labelWidth.value[index.value] / 2}px`,
        transition: `width ${duration.value}ms`,
      };
    } else {
      return {
        height: `${fullLength.value <= 1 ? 0 : 2}px`,
        width: `${labelWidth.value[index.value]}px`,
        position: `relative`,
        left: `${offset.value}px`,
        transition: `left linear ${duration.value}ms, width ${duration.value}ms`,
      };
    }
  });

  function handlePan(e) {
    position.value = false;
    const temp =
      distance.value -
      (e.detail.global.deltaX / width.value) * labelWidth.value[index.value];

    if (
      temp > 0 &&
      temp < fullWidth.value - labelWidth.value[fullLength.value - 1]
    ) {
      if (temp <= left.value) {
        scrollLeft.value = Math.random() / 1e7;
      } else if (temp >= right.value) {
        scrollLeft.value = right.value + Math.random() / 1e7;
      } else {
        scrollLeft.value =
          temp - width.value / 2 + labelWidth.value[index.value] / 2;
      }
      offset.value = temp;
    }

    if (e.type == "panend") {
      setDuration(200);
      if (distance.value <= left.value) {
        scrollLeft.value = 0;
      } else if (distance.value >= right.value) {
        scrollLeft.value = right.value;
      } else {
        position.value = true;
        scrollLeft.value =
          distance.value - width.value / 2 + labelWidth.value[index.value] / 2;
      }
      offset.value = distance.value;
    }
  }

  function onChange(widthObj) {
    if (Object.values(widthObj).every((item) => item == 0)) return;
    labelWidth.value = widthObj;
    nextTick(() => {
      setIndex();
    });
  }

  function onResize(size) {
    if (size.width == 0 || size.height == 0) return;
    width.value = size.width;
    height.value = size.height;
  }

  function setIndex(indexValue) {
    if (indexValue) index.value = indexValue;
    if (distance.value <= left.value) {
      scrollLeft.value = 0;
    } else if (distance.value >= right.value) {
      scrollLeft.value = right.value;
    } else {
      scrollLeft.value =
        distance.value - width.value / 2 + labelWidth.value[index.value] / 2;
    }
    offset.value = distance.value;
  }

  function setDuration(durationValue) {
    duration.value = durationValue;
    if (durationValue <= 0) return;
    setTimeout(() => {
      position.value = false;
      duration.value = 0;
    }, durationValue);
  }

  return {
    scrollLeft,
    duration,
    indicatorStyle,
    handlePan,
    onChange,
    onResize,
    setIndex,
    setDuration,
  };
}
