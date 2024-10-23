/* eslint-env serviceworker */

/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

import { clientsClaim } from "workbox-core";
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
} from "workbox-precaching";
import { registerRoute, NavigationRoute } from "workbox-routing";

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
    clientsClaim();
    cleanupOutdatedCaches();
  }
});

// Non-SSR fallback to index.html
// Production SSR fallback to offline.html (except for dev)
if (process.env.MODE !== "ssr" || process.env.PROD) {
  registerRoute(
    new NavigationRoute(
      createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
      {
        denylist: [
          new RegExp(process.env.PWA_SERVICE_WORKER_REGEX),
          /workbox-(.)*\.js$/,
        ],
      }
    )
  );
}
