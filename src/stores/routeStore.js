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
      if (this.cachedViews.includes(view)) return;
      this.cachedViews.push(view);
    },
    removeCachedView(view) {
      const index = this.cachedViews.indexOf(view);
      if (index > -1) {
        this.cachedViews.splice(index, 1);
      }
    },
  },
});
