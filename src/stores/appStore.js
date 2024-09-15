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
    nextBundleId: undefined,
    serviceWorker: undefined,
    networkStatus: undefined,

    instruction: undefined,
    systemWebview: undefined,
    upgradeWebview: undefined,
    upgradeProcess: undefined,
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
    getNextBundleId() {
      return this.nextBundleId;
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
    getInstruction() {
      return this.instruction;
    },
    getSystemWebview() {
      return this.systemWebview;
    },
    getUpgradeWebview() {
      return this.upgradeWebview;
    },
    getUpgradeProcess() {
      return this.upgradeProcess;
    },
  },
  actions: {
    setCurrentBundleId(bundleId) {
      this.currentBundleId = bundleId;
    },
    setLatestBundle(value) {
      this.latestBundle = value;
    },
    setNextBundleId(bundleId) {
      this.nextBundleId = bundleId;
    },
    setServiceWorker(key, value) {
      this.serviceWorker = this.serviceWorker ?? {};
      this.serviceWorker[key] = value;
    },
    setNetworkStatus(value) {
      this.networkStatus = value;
    },
    setInstruction(value) {
      this.instruction = value;
    },
    setSystemWebview(value) {
      this.systemWebview = value;
    },
    setUpgradeWebview(value) {
      this.upgradeWebview = value;
    },
    setUpgradeProcess(value) {
      this.upgradeProcess = value;
    },
  },
});
