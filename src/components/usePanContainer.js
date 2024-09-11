import { ref, computed } from "vue";

export function usePanContainer(props) {
  const index = ref(props.index);
  const width = ref(0);
  const height = ref(0);
  const offset = ref(0);
  const delay = ref(0);
  const fullLength = ref(0);

  const distance = computed(() => -index.value * length.value);
  const length = computed(() => (props.vertical ? height.value : width.value));

  const panStyle = computed(() => {
    return props.vertical
      ? {
          transform: `translate(0, ${offset.value}px)`,
          transition: `transform ${delay.value}s`,
        }
      : {
          transform: `translate(${offset.value}px, 0)`,
          transition: `transform ${delay.value}s`,
        };
  });

  function handlePan(e) {
    delay.value = 0;
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
      const time =
        (length.value - Math.abs(tempOffset)) / Math.abs(velocity) / 666;
      delay.value = time > 0.3 ? 0.3 : time;
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
    delay.value = 0;
    width.value = size.width;
    height.value = size.height;
    offset.value = distance.value;
  }

  function onContainerResize(size) {
    fullLength.value = props.vertical ? size.height : size.width;
  }

  function setIndex(indexValue, delayValue = 0) {
    index.value = indexValue;
    delay.value = delayValue;
    offset.value = distance.value;
  }

  return {
    panStyle,
    index,
    handlePan,
    onResize,
    onContainerResize,
    setIndex,
  };
}
