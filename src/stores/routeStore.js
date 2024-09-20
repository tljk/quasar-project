import { defineStore } from "pinia";

export const useRouteStore = defineStore("route", {
  state: () => ({
    position: 0,
    cachedViews: [],
  }),
  getters: {
    getPosition() {
      return this.position;
    },
    getCachedViews() {
      return this.cachedViews;
    },
  },
  actions: {
    setPosition(position) {
      this.position = position;
    },
    addCachedView(view) {
      this.cachedViews.push(view);
    },
    removeCachedView(view) {
      const index = this.cachedViews.lastIndexOf(view);
      if (index > -1) {
        this.cachedViews.splice(index, 1);
      }
    },
  },
});
