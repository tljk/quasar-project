import { boot } from "quasar/wrappers";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app }) => {
  const gestures = ["pan", "pinch"];
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
    });
  });
});
