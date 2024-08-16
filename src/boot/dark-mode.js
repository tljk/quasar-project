import { boot } from "quasar/wrappers";
import { DarkMode } from "@aparajita/capacitor-dark-mode";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ router }) => {
  router
    .isReady()
    .then(() => {
      DarkMode.init().catch(console.error);
    })
    .catch(console.error);
});
