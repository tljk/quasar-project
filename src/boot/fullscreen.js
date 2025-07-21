import { defineBoot } from "#q-app/wrappers";
import { StatusBar } from "@capacitor/status-bar";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli-vite/boot-files
export default defineBoot(() => {
  const appElement = document.getElementById("q-app");
  if (!appElement) return;

  const onFullscreenChange = () => {
    if (document.fullscreenElement) {
      StatusBar.hide().catch(() => {});
    } else {
      StatusBar.show().catch(() => {});
    }
  };

  appElement.addEventListener("fullscreenchange", onFullscreenChange);
});
