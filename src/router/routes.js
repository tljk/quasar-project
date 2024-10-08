const routes = [
  {
    path: "/",
    alias: "/home",
    component: () => import("pages/HomePage.vue"),
  },
  {
    path: "/detail/:id?",
    component: () => import("pages/DetailPage.vue"),
  },
  {
    path: "/about",
    component: () => import("pages/AboutPage.vue"),
  },
  {
    path: "/wifi-scan",
    component: () => import("pages/WifiScanPage.vue"),
  },
  {
    path: "/barcode-scan",
    component: () => import("pages/BarcodeScanPage.vue"),
  },
  {
    path: "/geolocation",
    component: () => import("pages/GeolocationPage.vue"),
  },
  {
    path: "/camera",
    component: () => import("pages/CameraPage.vue"),
  },
  {
    path: "/pinch-container",
    component: () => import("pages/PinchContainerPage.vue"),
  },
  {
    path: "/pan-container",
    component: () => import("pages/PanContainerPage.vue"),
  },
  {
    path: "/grid-preview",
    component: () => import("pages/GridPreviewPage.vue"),
  },
  {
    path: "/video-preview",
    component: () => import("pages/VideoPreviewPage.vue"),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
