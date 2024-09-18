import { boot } from "quasar/wrappers";
import { Platform } from "quasar";
import routes from "@/router/routes";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  if (Platform.is.capacitor) {
    routes.forEach((route) => {
      route.component();
    });
  }
});
