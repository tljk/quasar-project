import { boot } from "quasar/wrappers";
import { defineCustomElements } from "@ionic/pwa-elements/loader";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot((/* { app, router, ... } */) => {
  defineCustomElements(window);
});
