import { boot } from "quasar/wrappers";
import Hammer from "hammerjs";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app }) => {
  app.directive("pan", {
    mounted(el, binding, vnode) {
      const hammer = new Hammer(el);
      hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL });
      hammer.on("panstart panmove panend", (event) => {
        if (event.type === "panstart") event.isFirst = true;
        if (event.type === "pinchend") event.isFinal = true;
        binding.value(event);
      });
    },
  });
  app.directive("pinch", {
    mounted(el, binding, vnode) {
      const hammer = new Hammer(el);
      hammer.get("pinch").set({ enable: true });
      hammer.on("pinchstart pinchmove pinchend", (event) => {
        if (event.type === "pinchstart") event.isFirst = true;
        if (event.type === "pinchend") event.isFinal = true;
        binding.value(event);
      });
    },
  });
});
