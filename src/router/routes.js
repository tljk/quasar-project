const routes = [
  {
    path: "/",
    component: () => import("src/layouts/MainLayout.vue"),
    children: [
      {
        path: "/home",
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
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
