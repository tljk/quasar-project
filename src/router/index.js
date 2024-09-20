import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { useRouteStore } from "@/stores/routeStore";
import routes from "./routes";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const routeStore = useRouteStore();

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from) => {
    if (from.path == "/" && to.path == "/") {
      routeStore.addCachedView(to.path);
      return;
    }
    const isBack = routeStore.position > window.history.state.position;
    if (isBack) {
      to.meta.enterActiveClass = "animated slideInLeft";
      to.meta.leaveActiveClass = "animated slideOutRight z-top";
      routeStore.removeCachedView(from.path);
    } else {
      to.meta.enterActiveClass = "animated slideInRight z-top";
      to.meta.leaveActiveClass = "animated slideOutLeft";
      routeStore.addCachedView(to.path);
    }
  });

  Router.afterEach((to, from) => {
    routeStore.setPosition(window.history.state?.position || 0);
  });

  return Router;
});
