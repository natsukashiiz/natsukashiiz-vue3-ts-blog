import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/AuthStore';

function isAuth(
    to: RouteLocationNormalized,
    form: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated()) next({ name: 'signIn' });
    next();
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/in',
            name: 'InfiniteScroll',
            component: () => import('@/views/InfiniteScroll.vue')
        },
        {
            path: '/@:uname',
            name: 'profile',
            component: () => import('@/views/ProfileView.vue')
        },
        {
            path: '/',
            component: () => import('@/views/layouts/GlobalLayout.vue'),
            children: [
                {
                    path: '/',
                    name: 'home',
                    component: () => import('@/views/HomeView.vue')
                },
                {
                    path: 'sign-in',
                    name: 'signIn',
                    component: () => import('@/views/SignInView.vue')
                },
                {
                    path: 'blog/:id',
                    name: 'blog',
                    component: () => import('@/views/BlogView.vue')
                },
                {
                    path: 'blog/:id/write',
                    name: 'blogEditor',
                    component: () => import('@/views/EditorBlogView.vue'),
                    beforeEnter: isAuth
                },
                {
                    path: 'bookmarks',
                    name: 'bookmarks',
                    component: () => import('@/views/BookmarksView.vue')
                },
                {
                    path: 'settings',
                    name: 'settings',
                    component: () => import('@/views/AccountView.vue')
                }
            ]
        },
        {
            path: '/',
            component: () => import('@/views/layouts/PrivateLayout.vue'),
            beforeEnter: isAuth,
            children: [
                {
                    path: 'sign-history',
                    name: 'signHistory',
                    component: () => import('@/views/SignHistoryView.vue')
                }
            ]
        },
        {
            path: '/server-error',
            name: 'serverError',
            component: () => import('@/views/errors/ServerErrorView.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notFound',
            component: () => import('@/views/errors/NotFoundView.vue')
        }
    ]
});

export default router;
