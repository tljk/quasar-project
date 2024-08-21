import { AddressbarColor } from "quasar";
import { Platform, getCssVar } from "quasar";
import { StatusBar } from "@capacitor/status-bar";

export default async () => {
  AddressbarColor.set(getCssVar("primary"));
  if (Platform.is.capacitor) {
    StatusBar.setBackgroundColor({
      color: getCssVar("primary"),
    });
  }
};
