import { defineStore } from "pinia";
import { Platform } from "quasar";

export const useAppStore = defineStore("app", {
  state: () => ({
    version: process.env.APP_VERSION,
    quasarMode: process.env.MODE,
    environment: process.env.NODE_ENV,
    device: Platform.is,

    currentBundleId: undefined,
    latestBundle: undefined,
    serviceWorker: undefined,
    networkStatus: undefined,
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
    getLatestBundle() {
      return this.latestBundle;
    },
    getDevice() {
      return this.device;
    },
    getServiceWorker() {
      return this.serviceWorker;
    },
    getNetworkStatus() {
      return this.networkStatus;
    },
  },
  actions: {
    setCurrentBundleId(bundleId) {
      this.currentBundleId = bundleId;
    },
    setLatestBundle(value) {
      this.latestBundle = value;
    },
    setServiceWorker(key, value) {
      this.serviceWorker = this.serviceWorker ?? {};
      this.serviceWorker[key] = value;
    },
    setNetworkStatus(value) {
      this.networkStatus = value;
    },
  },
});
