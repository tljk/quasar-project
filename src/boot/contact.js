import { boot } from "quasar/wrappers";
import { PointerListener } from "contactjs";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  const gestures = ["pan", "pinch"];

  gestures.forEach((gesture) => {
    app.directive(gesture, {
      mounted(el, binding, vnode) {
        el.pointerListener =
          el.pointerListener ??
          new PointerListener(el, {
            bubbles: binding.modifiers.bubbles ?? false,
          });
        el.pointerListener.on(
          [gesture, gesture + "start", gesture + "end"].join(" "),
          (event) => {
            if (event.detail.global.srcEvent.pauseX) {
              event.detail.global.deltaX = 0;
            }
            if (event.detail.global.srcEvent.pauseY) {
              event.detail.global.deltaY = 0;
            }
            binding.value(event);
            if (binding.modifiers.stop) {
              event.detail.global.srcEvent.stopPropagation();
            }
          }
        );
      },
    });
  });
});
