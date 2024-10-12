import { ref, computed } from "vue";

export function usePanContainer(props) {
  const index = ref(props.index);
  const width = ref(0);
  const height = ref(0);
  const offset = ref(0);
  const duration = ref(0);
  const fullLength = ref(0);

  const distance = computed(() => -index.value * length.value);
  const length = computed(() => (props.vertical ? height.value : width.value));

  const panStyle = computed(() => {
    return props.vertical
      ? {
          transform: `translate(0, ${offset.value}px)`,
          transition: `transform ${duration.value}ms`,
        }
      : {
          transform: `translate(${offset.value}px, 0)`,
          transition: `transform ${duration.value}ms`,
        };
  });

  function handlePan(e) {
    setDuration(0);
    const tempOffset = props.vertical
      ? e.detail.global.deltaY
      : e.detail.global.deltaX;
    const temp = distance.value + tempOffset;
    if (temp >= 0) {
      offset.value = 0;
    } else if (temp <= -fullLength.value + length.value) {
      offset.value = -fullLength.value + length.value;
    } else {
      offset.value = temp;
    }

    if (e.type == "panend") {
      const velocity = props.vertical
        ? e.detail.live.speedY
        : e.detail.live.speedX;
      const durationValue =
        (length.value - Math.abs(tempOffset)) / Math.abs(velocity);
      setDuration(durationValue > 300 ? 300 : durationValue);
      if (
        velocity > props.velocityThreshold ||
        tempOffset > length.value * props.distanceThreshold
      ) {
        // swipe left
        index.value = -Math.ceil(offset.value / length.value);
      } else if (
        velocity < -props.velocityThreshold ||
        tempOffset < -length.value * props.distanceThreshold
      ) {
        // swipe right
        index.value = -Math.floor(offset.value / length.value);
      }
      offset.value = distance.value;
    }
  }

  function onResize(size) {
    if (size.width == 0 || size.height == 0) return;
    width.value = size.width;
    height.value = size.height;
    offset.value = distance.value;
  }

  function onContainerResize(size) {
    if (size.width == 0 || size.height == 0) return;
    fullLength.value = props.vertical ? size.height : size.width;
  }

  function setIndex(indexValue) {
    index.value = indexValue;
    offset.value = distance.value;
  }

  function setDuration(durationValue) {
    duration.value = durationValue;
    if (durationValue <= 0) return;
    setTimeout(() => {
      duration.value = 0;
    }, durationValue);
  }

  return {
    panStyle,
    index,
    handlePan,
    onResize,
    onContainerResize,
    setIndex,
    setDuration,
  };
}
