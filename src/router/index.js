import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
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
  let position = 0;

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
    if (from.path == "/" && to.path == "/") return;
    const isBack = position > window.history.state.position;
    if (isBack) {
      to.meta.enterActiveClass = "animated slideInLeft";
      to.meta.leaveActiveClass = "animated slideOutRight fullscreen";
    } else {
      to.meta.enterActiveClass = "animated slideInRight fullscreen";
      to.meta.leaveActiveClass = "animated slideOutLeft";
    }
  });

  Router.afterEach((to, from) => {
    position = window.history.state?.position || 0;
  });

  return Router;
});
