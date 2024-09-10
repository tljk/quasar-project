import { ref, computed } from "vue";

export function usePinchContainer(props) {
  const width = ref(0);
  const height = ref(0);
  const containerWidth = ref(0);
  const containerHeight = ref(0);
  const scale = ref(1);
  const scaleRatio = ref(1);
  const distanceX = ref(0);
  const offsetX = ref(0);
  const distanceY = ref(0);
  const offsetY = ref(0);
  const delay = ref(0);

  const pinchStyle = computed(() => {
    return {
      transform: `scale(${scaleRatio.value}) translate(${offsetX.value}px, ${offsetY.value}px)`,
      transition: `transform ${delay.value}s`,
    };
  });
  const maxDistanceX = computed(() => {
    const distance =
      (containerWidth.value * scaleRatio.value - width.value) /
      2 /
      scaleRatio.value;
    return distance > 0 ? distance : 0;
  });
  const maxDistanceY = computed(() => {
    const distance =
      (containerHeight.value * scaleRatio.value - height.value) /
      2 /
      scaleRatio.value;
    return distance > 0 ? distance : 0;
  });
  const borderReached = computed(() => {
    return {
      top: offsetY.value >= maxDistanceY.value,
      bottom: offsetY.value <= -maxDistanceY.value,
      left: offsetX.value >= maxDistanceX.value,
      right: offsetX.value <= -maxDistanceX.value,
    };
  });

  function handlePinch(e) {
    if (e.type == "pinchstart") {
      delay.value = 0;
    }

    const temp = scale.value * e.detail.global.scale;
    if (temp >= props.maxScaleRatio) {
      scaleRatio.value = props.maxScaleRatio;
    } else if (temp <= props.minScaleRatio) {
      scaleRatio.value = props.minScaleRatio;
    } else {
      scaleRatio.value = temp;
    }

    offsetX.value =
      distanceX.value +
      e.detail.global.deltaX / scaleRatio.value -
      ((scaleRatio.value / scale.value - 1) *
        (e.detail.global.center.x - width.value / 2)) /
        scaleRatio.value;
    offsetY.value =
      distanceY.value +
      e.detail.global.deltaY / scaleRatio.value -
      ((scaleRatio.value / scale.value - 1) *
        (e.detail.global.center.y - height.value / 2)) /
        scaleRatio.value;

    if (e.type == "pinchend") {
      delay.value = 0.3;
      if (scaleRatio.value <= 1) {
        scale.value = scaleRatio.value = 1;
        distanceX.value = offsetX.value = 0;
        distanceY.value = offsetY.value = 0;
      } else {
        scale.value = scaleRatio.value;
        if (offsetX.value > maxDistanceX.value) {
          distanceX.value = offsetX.value = maxDistanceX.value;
        } else if (offsetX.value < -maxDistanceX.value) {
          distanceX.value = offsetX.value = -maxDistanceX.value;
        } else {
          distanceX.value = offsetX.value;
        }
        if (offsetY.value > maxDistanceY.value) {
          distanceY.value = offsetY.value = maxDistanceY.value;
        } else if (offsetY.value < -maxDistanceY.value) {
          distanceY.value = offsetY.value = -maxDistanceY.value;
        } else {
          distanceY.value = offsetY.value;
        }
      }
    }
  }

  function handlePan(e) {
    delay.value = 0;
    const tempX = distanceX.value + e.detail.global.deltaX / scale.value;
    const tempY = distanceY.value + e.detail.global.deltaY / scale.value;

    if (tempX > maxDistanceX.value) {
      offsetX.value = maxDistanceX.value;
    } else if (tempX < -maxDistanceX.value) {
      offsetX.value = -maxDistanceX.value;
    } else {
      offsetX.value = tempX;
    }
    if (tempY > maxDistanceY.value) {
      offsetY.value = maxDistanceY.value;
    } else if (tempY < -maxDistanceY.value) {
      offsetY.value = -maxDistanceY.value;
    } else {
      offsetY.value = tempY;
    }

    if (e.type == "panend") {
      delay.value = 0.3;
      if (scale.value <= 1) {
        distanceX.value = offsetX.value = 0;
        distanceY.value = offsetY.value = 0;
      } else {
        distanceX.value = offsetX.value;
        distanceY.value = offsetY.value;
      }
    }
  }

  function onResize(size) {
    delay.value = 0;
    width.value = size.width;
    height.value = size.height;
    distanceX.value = offsetX.value;
    distanceY.value = offsetY.value;
  }

  function onContainerResize(size) {
    containerWidth.value = size.width;
    containerHeight.value = size.height;
  }

  return {
    pinchStyle,
    scaleRatio,
    offsetX,
    offsetY,
    borderReached,
    handlePinch,
    handlePan,
    onResize,
    onContainerResize,
  };
}
