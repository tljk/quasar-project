import { ref, nextTick } from "vue";

export function useMorph(props) {
  const source = ref(props.from);
  const target = ref(props.to);
  const reverse = ref(props.reverse ?? false);
  const duration = ref(props.duration ?? 300);
  const onToggle = ref(props.onToggle ?? (() => {}));
  const onEnd = ref(props.onEnd ?? (() => {}));

  function morph() {
    onToggle.value();
    nextTick(() => {
      const sourceRect = source.value.getBoundingClientRect();
      const targetRect = target.value.getBoundingClientRect();
      const offset = {
        x:
          targetRect.left +
          targetRect.width / 2 -
          (sourceRect.left + sourceRect.width / 2),
        y:
          targetRect.top +
          targetRect.height / 2 -
          (sourceRect.top + sourceRect.height / 2),
      };
      const scale = Math.min(
        targetRect.width / sourceRect.width,
        targetRect.height / sourceRect.height
      );
      const inset = {
        vertical:
          targetRect.width > targetRect.height
            ? 0
            : (targetRect.height - targetRect.width) / 2,
        horizontal:
          targetRect.width > targetRect.height
            ? (targetRect.width - targetRect.height) / 2
            : 0,
      };

      const clone = target.value.cloneNode(true);

      Object.assign(clone.style, {
        touchAction: "none",
        pointerEvents: "none",
        zIndex: 6000,
        position: "absolute",
        top: `${targetRect.top}px`,
        left: `${targetRect.left}px`,
        width: `${targetRect.width}px`,
        height: `${targetRect.height}px`,
        transformOrigin: "center",
        transform: `translate(${reverse.value ? 0 : -offset.x}px, ${
          reverse.value ? 0 : -offset.y
        }px) scale(${reverse.value ? 1 : 1 / scale})`,
        clipPath: `inset(${reverse.value ? 0 : inset.vertical}px ${
          reverse.value ? 0 : inset.horizontal
        }px)`,
        willChange: "transform, clip-path",
      });
      document.body.appendChild(clone);

      clone.addEventListener(
        "transitionend",
        () => {
          onEnd.value();
          nextTick(() => {
            clone.parentNode.removeChild(clone);
          });
        },
        { once: true }
      );

      requestAnimationFrame(() => {
        Object.assign(clone.style, {
          transform: `translate(${reverse.value ? -offset.x : 0}px, ${
            reverse.value ? -offset.y : 0
          }px) scale(${reverse.value ? 1 / scale : 1})`,
          clipPath: `inset(${reverse.value ? inset.vertical : 0}px ${
            reverse.value ? inset.horizontal : 0
          }px)`,
          transition: `transform ${duration.value}ms, clip-path ${duration.value}ms`,
        });
      });
    });
  }

  return { morph };
}
