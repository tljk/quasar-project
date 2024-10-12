import { ref, computed } from "vue";

export function usePanTabBar(index, labelWidthRef) {
  const width = ref(0);
  const offset = ref(0);
  const duration = ref(0);

  const left = computed(() => {
    return 0;
  });
  const right = computed(() => {
    const fullWidth = Object.values(labelWidthRef.value).reduce(
      (acc, cur) => acc + cur,
      0
    );
    return fullWidth;
  });
  const distance = computed(() => {
    let temp = 0;
    for (let i = 0; i < index.value; i++) {
      temp += labelWidthRef.value[i];
    }
    return temp - width.value / 2 + labelWidthRef.value[index.value] / 2;
  });

  function handlePan(e) {
    const temp =
      distance.value -
      (e.detail.global.deltaX / width.value) *
        labelWidthRef.value[
          e.detail.global.deltaX < 0 ? index.value : index.value - 1
        ];

    if (temp < left.value && e.detail.global.deltaX <= 0) {
      offset.value = 0;
    } else if (temp > right.value && e.detail.global.deltaX >= 0) {
      offset.value = right.value;
    } else {
      offset.value = temp;
    }

    if (e.type == "panend") {
      setDuration(200);
      if (distance.value < left.value) {
        offset.value = 0;
      } else if (distance.value > right.value) {
        offset.value = right.value;
      } else {
        offset.value = distance.value;
      }
    }
  }

  function onChange(val) {
    setDuration(200);
    index.value = val;
    if (distance.value < left.value) {
      offset.value = 0;
    } else if (distance.value > right.value) {
      offset.value = right.value;
    } else {
      offset.value = distance.value;
    }
  }

  function onResize(size) {
    if (size.width == 0 || size.height == 0) return;
    width.value = size.width;
  }

  function setDuration(durationValue) {
    duration.value = durationValue;
    if (durationValue <= 0) return;
    setTimeout(() => {
      duration.value = 0;
    }, durationValue);
  }

  return {
    offset,
    duration,
    handlePan,
    onChange,
    onResize,
  };
}
