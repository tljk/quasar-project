import { defineBoot } from "#q-app/wrappers";
import { useGestures } from "@/composables/useGestures";
import { TapRecognizer } from "@/utils/gestures/TapRecognizer";
import { DragRecognizer } from "@/utils/gestures/DragRecognizer";
import { PinchRecognizer } from "@/utils/gestures/PinchRecognizer";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(({ app }) => {
  app.directive("gesture", {
    mounted(element, binding) {
      const { registerGesture, addEventListeners } = useGestures(element);
      const { value, arg, modifiers } = binding;
      const gestures = arg ? arg.split(":") : Object.keys(modifiers);
      const gestureOptions = Array.isArray(value) ? value : [];

      gestures.forEach((gesture, idx) => {
        const options = gestureOptions[idx] ?? {};
        switch (gesture) {
          case "tap":
            registerGesture("tap", new TapRecognizer(options));
          case "drag":
            registerGesture("drag", new DragRecognizer(options));
          case "pinch":
            registerGesture("pinch", new PinchRecognizer(options));
        }
      });

      addEventListeners();
    },
    unmounted(element) {
      const { removeEventListeners } = useGestures(element);
      removeEventListeners();
    },
  });
});
