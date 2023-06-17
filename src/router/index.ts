import { createRouter, createWebHistory } from "vue-router";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import {useAuthStore} from "@/stores/AuthStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("@/views/layouts/GlobalLayout.vue"),
      children: [
        {
          path: "/",
          name: "home",
          component: () => import("@/views/Home.vue")
        },
        {
          path: "sign-in",
          name: "signIn",
          component: () => import("@/views/SignIn.vue")
        },
        {
          path: "sign-up",
          name: "signUp",
          component: () => import("@/views/SignUp.vue")
        }
      ]
    },
    {
      path: "/account",
      component: () => import("@/views/layouts/PrivateLayout.vue"),
      beforeEnter: (to: RouteLocationNormalized, form: RouteLocationNormalized, next: NavigationGuardNext) => {
        const authStore = useAuthStore();
        if (!authStore.isAuthenticated()) next({ name : "signIn" });
        next();
      },
      children: [
        {
          path: "profile",
          name: "profile",
          component: () => import("@/views/Profile.vue")
        },
        {
          path: "sign-history",
          name: "signHistory",
          component: () => import("@/views/SignHistory.vue")
        }
      ]
    }
  ]
});

export default router;
