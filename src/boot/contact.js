import { boot } from "quasar/wrappers";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  const gestures = ["tap", "pan", "pinch"];
  gestures.forEach((gesture) => {
    app.directive(gesture, {
      mounted(el, binding, vnode) {
        el.addEventListener(gesture, (e) => {
          binding.value(e);
        });
        el.addEventListener(gesture + "start", (e) => {
          binding.value(e);
        });
        el.addEventListener(gesture + "end", (e) => {
          binding.value(e);
        });
      },
      unmounted(el, binding, vnode) {
        el.removeEventListener(gesture, binding.value);
        el.removeEventListener(gesture + "start", binding.value);
        el.removeEventListener(gesture + "end", binding.value);
      },
    });
  });
});
