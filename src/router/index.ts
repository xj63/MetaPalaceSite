import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/select",
    name: "select",
    component: () => import("@/views/SelectView.vue"),
  },
  {
    path: "/detail/:id",
    name: "detail",
    component: () => import("@/views/DetailView.vue"),
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/NotFound.vue"),
  },
  { path: "/:pathMatch(.*)*", redirect: "/404" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
