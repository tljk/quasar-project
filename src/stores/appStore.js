import { defineStore } from "pinia";
import { Platform } from "quasar";

export const useAppStore = defineStore("app", {
  state: () => ({
    version: process.env.APP_VERSION,
    quasarMode: process.env.MODE,
    environment: process.env.NODE_ENV,
    currentBundleId: undefined,
    device: Platform.is,
    serviceWorker: {},
  }),
  getters: {
    getVersion() {
      return this.version;
    },
    getQuasarMode() {
      return this.quasarMode;
    },
    getEnvironment() {
      return this.environment;
    },
    getCurrentBundleId() {
      return this.currentBundleId;
    },
    getDevice() {
      return this.device;
    },
  },
  actions: {
    setCurrentBundleId(bundleId) {
      this.currentBundleId = bundleId;
    },
    setServiceWorker(key, value) {
      this.serviceWorker[key] = value;
    },
  },
});
