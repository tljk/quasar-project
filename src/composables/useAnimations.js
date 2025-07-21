import { ref, onActivated, onDeactivated, onMounted } from "vue";

export function useAnimations(elementRef) {
  const animations = new Map();
  const transform = ref({});

  const registerAnimation = (name, keyframeEffect) => {
    const animation = new Animation(keyframeEffect);
    animation.id = name;
    animations.set(name, animation);

    return animation.ready;
  };

  const applyAnimation = (
    name,
    keyframe,
    options,
    composite,
    boundaries,
    callback
  ) => {
    if (!elementRef.value) return;
    if (boundaries) {
      const computedStyle = getComputedStyle(elementRef.value);
      const computedTransforms = parseTransform(computedStyle.transform);
      const keyframeTransforms = parseTransform(keyframe.transform);

      const checked = new Map();
      const bounded = new Map();

      for (const boundary of boundaries) {
        const value = keyframeTransforms[boundary.name];
        let min =
          typeof boundary.min === "function" ? boundary.min() : boundary.min;
        let max =
          typeof boundary.max === "function" ? boundary.max() : boundary.max;

        if (min === NaN || max === NaN) continue;
        if (min > max) [min, max] = [max, min];
        if (composite === "accumulate") {
          if (boundary.name.includes("scale")) {
            min /= computedTransforms[boundary.name];
            max /= computedTransforms[boundary.name];
          } else {
            min -= computedTransforms[boundary.name];
            max -= computedTransforms[boundary.name];
          }
        }

        if (value <= min + 0.01) {
          bounded.set(boundary.name, "min");
          checked.set(boundary.name, min);
        } else if (value >= max - 0.01) {
          bounded.set(boundary.name, "max");
          checked.set(boundary.name, max);
        } else {
          checked.set(boundary.name, value);
        }
      }

      if (callback && bounded.size > 0) callback(bounded);
      keyframe.transform = buildTransform(checked);

      transform.value = computedTransforms;
    }

    const keyframeEffect = new KeyframeEffect(
      elementRef.value,
      keyframe,
      options
    );
    keyframeEffect.composite = composite;
    const animation = new Animation(keyframeEffect);
    animation.id = name;
    animations.set(name, animation);

    return animation.ready;
  };

  const playAnimation = (name) => {
    const animation = animations.get(name);
    if (animation) {
      animation.play();
      return animation.finished;
    }
    return Promise.reject(new Error(`Animation "${name}" not found`));
  };

  const pauseAnimation = (name) => {
    const animation = animations.get(name);
    if (animation) {
      animation.pause();
      return animation.ready;
    }
    return Promise.reject(new Error(`Animation "${name}" not found`));
  };

  const stopAnimation = (name) => {
    const animation = animations.get(name);
    if (animation) {
      animation.cancel();
      animations.delete(name);
    }
  };

  const commitStyle = (name) => {
    const animation = animations.get(name);
    if (animation) {
      animation.commitStyles();
    }
  };

  const parseTransform = (transformString) => {
    const result = {};

    if (transformString === "none") return result;

    if (transformString.includes("matrix")) {
      const values = transformString
        .match(/matrix.*?\((.+?)\)/)?.[1]
        ?.split(",")
        .map(Number);
      if (values && values.length >= 6) {
        result.translateX = values[4];
        result.translateY = values[5];
        result.scaleX = Math.sqrt(
          values[0] * values[0] + values[1] * values[1]
        );
        result.scaleY = Math.sqrt(
          values[2] * values[2] + values[3] * values[3]
        );
      }
    } else {
      const translateX = transformString.match(/translateX\(([^)]+)\)/);
      const translateY = transformString.match(/translateY\(([^)]+)\)/);
      const scale = transformString.match(/scale\(([^)]+)\)/);
      const rotate = transformString.match(/rotate\(([^)]+)\)/);

      if (translateX) result.translateX = parseFloat(translateX[1]);
      if (translateY) result.translateY = parseFloat(translateY[1]);
      if (scale) result.scaleX = result.scaleY = parseFloat(scale[1]);
      if (rotate) result.rotate = parseFloat(rotate[1]);
    }

    return result;
  };

  const buildTransform = (map) => {
    let parts = [];

    if (map.has("translateX")) {
      parts.push(`translateX(${map.get("translateX")}px)`);
    }
    if (map.has("translateY")) {
      parts.push(`translateY(${map.get("translateY")}px)`);
    }
    const scaleX = map.get("scaleX");
    const scaleY = map.get("scaleY");
    if (scaleX !== undefined) {
      parts.push(`scale(${scaleX})`);
    } else if (scaleY !== undefined) {
      parts.push(`scale(${scaleY})`);
    }
    if (map.has("rotate")) {
      parts.push(`rotate(${map.get("rotate")}deg)`);
    }

    return parts.length ? parts.join(" ") : "none";
  };

  onMounted(() => {
    const computedStyle = getComputedStyle(elementRef.value);
    const computedTransforms = parseTransform(computedStyle.transform);
    transform.value = computedTransforms;
  });

  onActivated(() => {
    for (const [name, animation] of animations) {
      if (animation.playState === "paused") {
        animation.play();
      }
    }
  });

  onDeactivated(() => {
    for (const [name, animation] of animations) {
      if (animation.playState === "running") {
        animation.pause();
      }
    }
  });

  return {
    registerAnimation,
    applyAnimation,
    playAnimation,
    pauseAnimation,
    stopAnimation,
    commitStyle,
    parseTransform,
    buildTransform,
    transform,
  };
}
